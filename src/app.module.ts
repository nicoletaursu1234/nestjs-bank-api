import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Count } from './count/entities/count.entity';
import { DatabaseModule } from './db/db.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Account, Count]),
    UserModule,
    AccountModule,
    AuthModule,
    TransactionModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    UserController,
    AccountController,
    TransactionController,
  ],
  providers: [AppService],
})
export class AppModule {}
