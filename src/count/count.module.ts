import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CountService } from 'src/count/count.service';
import { Count } from './entities/count.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [
    forwardRef(() => PassportModule.register({ defaultStrategy: 'jwt' })),
    TypeOrmModule.forFeature([Count, Transaction]),
  ],
  providers: [CountService],
  exports: [CountService],
})
export class CountModule {}
