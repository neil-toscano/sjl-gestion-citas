import { IsDateString } from 'class-validator';

export class FindByWeekDto {
  @IsDateString()
  date: string; 
}