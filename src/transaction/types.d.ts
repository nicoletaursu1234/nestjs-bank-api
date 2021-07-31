import { ICount } from 'src/count/types';
import { BaseEntity } from 'typeorm';

export interface ITransaction extends BaseEntity {
  id: string;
  sum: number;
  currency: string;
  receiver: string;
  status: string;
  bankName: string;
  sender: string;
  createdAt: string;
  updatedAt?: string;
  count: Partial<ICount>;
}

export interface ITransactionResponse extends ITransaction {
  accountNumber: string;
}
