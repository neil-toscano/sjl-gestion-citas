import { IsDateString, IsString, MinLength } from 'class-validator';

export class UpdatePassword {
  @IsString()
  @MinLength(6)
  password: string;
}