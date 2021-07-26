import { BaseEntity } from 'typeorm';
import { IUser } from 'src/user/types';
import { ICount } from 'src/count/types';

export interface IAccount extends BaseEntity {
  id: string;
  accountNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  avatar?: string;
  phoneNumber?: string;
  count: ICount[];
  user: IUser;
}
