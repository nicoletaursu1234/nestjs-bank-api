import { IsCurrency, IsDecimal, IsString } from 'class-validator';

export default class TransactionDTO {
  @IsDecimal()
  @IsCurrency()
  sum: number;

  @IsString()
  currency: string;

  @IsString()
  receiver: string;
}
