import {
  Body,
  Controller,
  Post,
  Req,
  HttpCode,
  UseGuards,
  Res,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import TransactionDTO from './dto/transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getTransaction(
    @Param('id', ParseUUIDPipe) trxId: string,
  ): Promise<Transaction> {
    return await this.transactionService.getTransaction(trxId);
  }

  @Get('status/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getStatus(@Param('id', ParseUUIDPipe) trxId: string): Promise<string> {
    return await this.transactionService.getTransactionStatus(trxId);
  }

  @Get('all/list/:countId')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TransactionDTO] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAllTransactions(
    @Param('countId') countId: string,
  ): Promise<Transaction[]> {
    return await this.transactionService.getAllTransactions(countId);
  }

  @Get('all/download/:countId')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async downloadTransactions(
    @Res() res: Response,
    @Param('countId') countId: string,
  ): Promise<any> {
    return await this.transactionService.downloadTransactions(res, countId);
  }

  @Post('new')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async newTransaction(
    @Body() transactionBody: TransactionDTO,
    @Req() { user }: Request & { user: User },
    @Res() res: Response,
  ): Promise<any> {
    const transaction = await this.transactionService.newTransaction(
      user,
      transactionBody,
    );
    await res.send(transaction);

    setTimeout(async () => {
      await this.transactionService.setStatusInReview(transaction);
    }, 1000 * 20);

    setTimeout(async () => {
      await this.transactionService.setStatusResponse(transaction);
    }, 1000 * 40);
  }

  @Post('cancel/:id')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async cancelTransaction(
    @Param('id', ParseUUIDPipe) trxId: string,
  ): Promise<string> {
    return await this.transactionService.cancelTransaction(trxId);
  }
}
