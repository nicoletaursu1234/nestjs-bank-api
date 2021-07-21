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
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(50)
  email?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsMobilePhone()
  @Matches(/^[0-9]{9,11}$/, {
    message: 'phoneNumber should be a phone number.',
  })
  phoneNumber?: string;
}
