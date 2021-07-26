import { ICount } from 'src/count/types';
import { BaseEntity } from 'typeorm';

export interface ITransaction extends BaseEntity {
  id: string;
  sum: number;
  currency: string;
  receiver: string;
  status: string;
  count: Partial<ICount>;
}
