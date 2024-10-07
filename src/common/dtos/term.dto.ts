import { IsString } from 'class-validator';

export class TermDto {
  @IsString()
  field: string;

  @IsString()
  value: string;
}
