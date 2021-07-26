import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { CountService } from 'src/count/count.service';
import { CountModule } from 'src/count/count.module';
import { Count } from 'src/count/entities/count.entity';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Account, User, Count]),
    CountModule,
  ],
  providers: [AccountService, CountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
