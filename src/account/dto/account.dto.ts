import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsMobilePhone,
  Matches,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export default class AccountDTO {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty({ type: String })
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty({ type: String })
  lastName?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(50)
  @ApiProperty({ type: String })
  email?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: String })
  dateOfBirth?: string;

  @IsOptional()
  @IsMobilePhone()
  @Matches(/^[0-9]{8,11}$/)
  @ApiProperty({ type: String })
  phoneNumber?: string;
}
