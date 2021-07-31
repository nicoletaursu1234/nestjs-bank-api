import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsDecimal, IsString } from 'class-validator';

export default class TransactionDTO {
  @IsDecimal()
  @IsCurrency()
  @ApiProperty({ type: Number })
  sum: number;

  @IsString()
  @ApiProperty({ type: String })
  currency: string;

  @IsString()
  @ApiProperty({ type: String })
  receiver: string;

  @IsString()
  @ApiProperty({ type: String })
  sender: string;

  @IsString()
  @ApiProperty({ type: String })
  bankName: string;
}
