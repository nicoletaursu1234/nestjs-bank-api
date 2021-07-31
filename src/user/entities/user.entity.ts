import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IUser } from '../types';
import { Account } from 'src/account/entities/account.entity';
import PasswordTransformer from 'src/auth/password-transformer';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  constructor({ id, login, password, account }: Partial<IUser> = {}) {
    super();

    this.id = id;
    this.login = login;
    this.password = password;
    this.account = account;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password: string;

  @OneToOne(() => Account, (account) => account.user, { eager: true })
  @JoinColumn({ name: 'account' })
  account: Account;
}
