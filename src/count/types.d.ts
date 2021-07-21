import { IAccount } from 'src/account/types';
import { BaseEntity } from 'typeorm';

export interface ICount extends BaseEntity {
  id: string;
  amount: string;
  account: IAccount;
}
