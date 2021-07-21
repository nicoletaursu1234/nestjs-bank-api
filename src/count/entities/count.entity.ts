import { Account } from 'src/account/entities/account.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICount } from '../types';

@Entity()
export class Count extends BaseEntity {
  constructor({ amount }: Partial<ICount> = {}) {
    super();

    this.amount = amount;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: string;

  @ManyToOne(() => Account, (account) => account.count)
  account: Account;
}
