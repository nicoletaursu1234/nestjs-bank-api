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
    count,
  }: Partial<ITransaction> = {}) {
    super();

    this.id = id;
    this.sum = sum;
    this.currency = currency;
    this.receiver = receiver;
    this.status = status;
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

  @ManyToOne(() => Count, (count) => count.transaction)
  @JoinColumn({ name: 'count' })
  count: Partial<Count>;
}
