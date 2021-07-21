import { Controller, Get, Req, UseGuards, Body, Put } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import AccountDTO from './dto/account.dto';
import { User } from 'src/user/entities/user.entity';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Account })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  async getAccount(
    @Req() { user: { account } }: Request & { user: User },
  ): Promise<Account> {
    return account;
  }

  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Account })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  async create(
    @Body() body: AccountDTO,
    @Req() { user }: Request & { user: User },
  ): Promise<Account> {
    const { account } = user;
    const accountUpdate = await new Account({ ...account, ...body }).save();

    return accountUpdate;
  }
}
