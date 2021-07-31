import { Count } from 'src/count/entities/count.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITransaction } from '../types';

@Entity()
export class Transaction extends BaseEntity {
  constructor({
    id,
    sum,
    currency,
    receiver,
    status,
    bankName,
    sender,
    createdAt,
    updatedAt,
    count,
  }: Partial<ITransaction> = {}) {
    super();

    this.id = id;
    this.sum = sum;
    this.currency = currency;
    this.receiver = receiver;
    this.status = status;
    this.bankName = bankName;
    this.sender = sender;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.count = count;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  sum: number;

  @Column()
  currency: string;

  @Column()
  receiver: string;

  @Column()
  status: string;

  @Column()
  sender: string;

  @Column()
  bankName: string;

  @Column()
  createdAt: string;

  @Column({ nullable: true })
  updatedAt?: string;

  @ManyToOne(() => Count, (count) => count.transaction)
  @JoinColumn({ name: 'count' })
  count: Partial<Count>;
}
