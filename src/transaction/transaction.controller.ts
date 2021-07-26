import {
  Body,
  Controller,
  Post,
  Req,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('new')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  async newTransaction(
    @Body() transactionBody: Transaction,
    @Req() { user }: Request & { user: User },
  ): Promise<any> {
    return await this.transactionService.newTransaction(user, transactionBody);
  }
}
