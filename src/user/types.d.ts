import { IAccount } from 'src/account/types';
import { BaseEntity } from 'typeorm';

export interface IUser extends BaseEntity {
  id: string;
  login: string;
  password: string;
  account: IAccount;
}
