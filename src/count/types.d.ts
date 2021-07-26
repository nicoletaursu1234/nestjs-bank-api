import { IAccount } from 'src/account/types';
import { ITransaction } from 'src/transaction/types';
import { BaseEntity } from 'typeorm';

export interface ICount extends BaseEntity {
  id: string;
  amount: number;
  currency: string;
  account: IAccount;
  transaction: ITransaction[];
}
