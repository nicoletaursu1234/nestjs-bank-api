import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as zlib from 'zlib';
import { pipeline } from 'stream';
import { json2csvAsync } from 'json-2-csv';

import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import Bignumber, { BigNumber } from 'bignumber.js';
import { TRANSACTION_STATUSES } from 'src/const/TransactionStatuses';
import { Count } from 'src/count/entities/count.entity';
import { ITransactionResponse } from './types';
import CsvReadable from 'src/utils/CsvReadable';
import TransactionDTO from './dto/transaction.dto';
import { CountService } from 'src/count/count.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly countService: CountService) {}

  async newTransaction(
    user: User,
    { sum, currency, receiver, sender, bankName }: TransactionDTO,
  ): Promise<Partial<Transaction>> {
    const fields = [sum, currency, receiver, bankName, sender];
    const checkFields = fields.every((field) => {
      this.logger.warn(field);
      return field;
    });

    if (!checkFields) {
      throw new BadRequestException('Please fill in all the required data');
    }

    if (receiver === sender) {
      throw new BadRequestException(
        'You cannot make a transaction to your own account',
      );
    }

    const receiverCount = await this.countService.getByAccountNumber(receiver);

    if (!receiverCount) {
      throw new NotFoundException(
        'The filled in account number does not exist',
      );
    }

    const countBelongsToUser = await user.account.count.find(
      ({ accountNumber }) => {
        return accountNumber === sender;
      },
    );

    if (!countBelongsToUser) {
      throw new NotFoundException(
        'There is no count for this account, please create one and try again',
      );
    }

    const senderCount = await this.countService.getByAccountNumber(receiver);
    const { transactionSum, diff } = await this.calculateDiff(senderCount, sum);

    if (diff < 0) {
      throw new BadRequestException(
        'Insufficient funds. Please fill your balance and try again.',
      );
    }

    let transaction;

    try {
      transaction = await new Transaction({
        sum: +transactionSum,
        currency,
        receiver,
        sender,
        bankName,
        status: TRANSACTION_STATUSES.CREATED,
        createdAt: new Date().toISOString(),
        count: senderCount,
      }).save();
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    return transaction;
  }

  async getTransaction(trxId: string): Promise<ITransactionResponse> {
    let transaction;

    try {
      transaction = await Transaction.findOne({
        where: { id: trxId },
      });

      if (!transaction) {
        throw new NotFoundException('No transaction found');
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    const hiddenAccountNumber = '*********' + transaction.receiver.slice(9);

    return {
      ...transaction,
      receiver: hiddenAccountNumber,
      accountNumber: transaction.sender,
    };
  }

  async getTransactionStatus(trxId: string): Promise<string> {
    try {
      const transaction = await Transaction.findOne({
        where: { id: trxId },
      });

      if (!transaction?.status) {
        throw new NotFoundException('Transaction not found');
      }
      return transaction.status;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async getAllTransactions(count: string): Promise<Transaction[]> {
    let transactions;

    try {
      transactions = await Transaction.find({
        where: { count },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    return transactions;
  }

  async setStatusInReview(transaction: Partial<Transaction>): Promise<string> {
    const status = await this.getTransactionStatus(transaction.id);
    const { CREATED } = TRANSACTION_STATUSES;

    if (status !== CREATED) return;

    let newTransaction: Transaction;

    try {
      newTransaction = await new Transaction({
        ...transaction,
        status: TRANSACTION_STATUSES.IN_REVIEW,
        updatedAt: new Date().toISOString(),
      }).save();
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    return newTransaction.status;
  }

  async setStatusResponse(transaction: Partial<Transaction>): Promise<string> {
    const status = await this.getTransactionStatus(transaction.id);
    const { COMPLETE, DECLINED, IN_REVIEW } = TRANSACTION_STATUSES;

    if (status !== IN_REVIEW) return;

    let newTransaction: Transaction;

    const senderCount = await this.countService.getByAccountNumber(
      transaction.sender,
    );

    const { diff } = this.calculateDiff(senderCount, transaction.sum);

    try {
      newTransaction = await new Transaction({
        ...transaction,
        status: diff >= 0 ? COMPLETE : DECLINED,
        updatedAt: new Date().toISOString(),
      }).save();
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    if (newTransaction.status === TRANSACTION_STATUSES.COMPLETE) {
      const receiver = await this.countService.getByAccountNumber(
        transaction.receiver,
      );

      await new Count({ ...senderCount, amount: diff }).save();
      await new Count({
        ...receiver,
        amount: this.calculateAddMoney(receiver, transaction.sum).newAmount,
      }).save();
    }

    return newTransaction.status;
  }

  async cancelTransaction(trxId: string): Promise<string> {
    const transaction = await this.getTransaction(trxId);
    const { CREATED, IN_REVIEW, CANCELED } = TRANSACTION_STATUSES;

    if (![CREATED, IN_REVIEW].includes(transaction.status)) {
      throw new BadRequestException(
        'The transaction can not be canceled anymore',
      );
    }

    let updatedTransaction: Transaction;

    try {
      updatedTransaction = await new Transaction({
        ...transaction,
        status: CANCELED,
        updatedAt: new Date().toISOString(),
      }).save();
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
    return updatedTransaction.status;
  }

  async downloadTransactions(res: Response, countId: string): Promise<void> {
    try {
      const transactions = await this.getAllTransactions(countId);
      const csv = await json2csvAsync(transactions, {
        emptyFieldValue: 'none',
        expandArrayObjects: true,
      });
      const csvStream = new CsvReadable(JSON.stringify(csv));

      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions.csv.gz"`,
      });

      pipeline(csvStream, zlib.createGzip(), res, (e) => {
        this.logger.error(e);
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  calculateDiff(
    count: Partial<Count>,
    sum: number,
  ): {
    countAmount: Bignumber;
    transactionSum: BigNumber;
    diff: number;
  } {
    const countAmount = new Bignumber(count.amount);
    const transactionSum = new Bignumber(sum);
    const diff = +countAmount.minus(transactionSum);

    return {
      countAmount,
      transactionSum,
      diff,
    };
  }

  calculateAddMoney(
    count: Partial<Count>,
    sum: number,
  ): {
    countAmount: Bignumber;
    transactionSum: BigNumber;
    newAmount: number;
  } {
    const countAmount = new Bignumber(count.amount);
    const transactionSum = new Bignumber(sum);
    const newAmount = +countAmount.plus(transactionSum);

    return {
      countAmount,
      transactionSum,
      newAmount,
    };
  }
}
