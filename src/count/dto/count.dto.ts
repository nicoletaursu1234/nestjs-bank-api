import { IsDecimal, IsCurrency, IsString } from 'class-validator';

export default class CountDTO {
  @IsDecimal()
  @IsCurrency()
  amount: number;

  @IsString()
  currency: string;
}
