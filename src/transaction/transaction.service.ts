import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import Bignumber from 'bignumber.js';
import { Count } from 'src/count/entities/count.entity';

@Injectable()
export class TransactionService {
  async newTransaction(
    user: User,
    { sum, currency, receiver }: Transaction,
  ): Promise<Partial<Transaction>> {
    if (!sum || !currency || !receiver) {
      throw new BadRequestException('Please fill in all the required data');
    }

    const receiverNumber = await Account.findOne({
      where: { accountNumber: receiver },
      relations: ['count'],
    });

    if (!receiverNumber) {
      throw new NotFoundException(
        'The filled in account number does not exist',
      );
    }

    const { count } = await Account.findOne({
      where: { id: user.account.id },
      relations: ['count'],
    });

    if (!count.length) {
      throw new NotFoundException(
        'There is no count for this account, please create one and try again',
      );
    }

    const countAmount = new Bignumber(count[0].amount);
    const transactionSum = new Bignumber(sum);
    const diff = +countAmount.minus(transactionSum);

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
        status: 'Created',
      });

      // await new Count({ ...count[0], amount: diff }).save(); when completed
    } catch (e) {
      console.error(e);
    }

    return transaction;
  }
}
