import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Count } from 'src/count/entities/count.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CountModule } from 'src/count/count.module';
import { CountService } from 'src/count/count.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Account, User, Count, Transaction]),
    CountModule,
  ],
  providers: [TransactionService, CountService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
