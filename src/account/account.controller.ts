import {
  Controller,
  Get,
  Req,
  UseGuards,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
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
import { AccountService } from './account.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Account })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  async get(
    @Req() { user: { account } }: Request & { user: User },
  ): Promise<Account> {
    return account;
  }

  @Put('/update')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Account })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  async update(
    @Body() body: AccountDTO,
    @Req() { user }: Request & { user: User },
  ): Promise<Partial<Account>> {
    return await this.accountService.update(body, user);
  }

  @Post('/upload-avatar')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AuthGuard())
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() { user }: Request & { user: User },
  ) {
    return await this.accountService.uploadAvatar(file, user);
  }
}
