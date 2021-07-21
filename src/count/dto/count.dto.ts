import { IsDecimal, IsCurrency } from 'class-validator';

export default class CountDTO {
  @IsDecimal()
  @IsCurrency()
  amount: number;
}
