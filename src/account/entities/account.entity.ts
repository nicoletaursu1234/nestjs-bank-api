import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IAccount } from '../types';
import { Count } from 'src/count/entities/count.entity';

@Entity()
export class Account extends BaseEntity {
  constructor({
    id,
    email,
    accountNumber,
    firstName,
    lastName,
    dateOfBirth,
    avatar,
    phoneNumber,
    count,
    user,
  }: Partial<IAccount> = {}) {
    super();

    this.id = id;
    this.email = email;
    this.accountNumber = accountNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.avatar = avatar;
    this.phoneNumber = phoneNumber;
    this.count = count;
    this.user = user;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true, nullable: true })
  phoneNumber?: string;

  @OneToOne(() => User, (user) => user.account, { nullable: true })
  @JoinColumn({ name: 'user' })
  user: User;

  @OneToMany(() => Count, (count) => count.account, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'count' })
  count: Count[];
}
