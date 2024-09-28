import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsDate,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @Length(8, 8)
  @IsString()
  dni: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsString()
  department: string;

  @IsString()
  province: string;

  @IsString()
  district: string;

  @IsPhoneNumber('PE') // Assuming it's for Peru, adjust accordingly
  @Length(9, 9)
  mobileNumber: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
