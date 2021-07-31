import { Account } from 'src/account/entities/account.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICount } from '../types';
import { Transaction } from 'src/transaction/entities/transaction.entity';
@Entity()
export class Count extends BaseEntity {
  constructor({
    id,
    accountNumber,
    amount,
    currency,
    account,
    transaction,
  }: Partial<ICount> = {}) {
    super();

    this.id = id;
    this.amount = amount;
    this.accountNumber = accountNumber;
    this.currency = currency;
    this.account = account;
    this.transaction = transaction;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountNumber: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @ManyToOne(() => Account, (account) => account.count)
  @JoinColumn({ name: 'account' })
  account: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.count, {
    eager: true,
  })
  @JoinColumn({ name: 'transaction' })
  transaction?: Transaction[];
}
