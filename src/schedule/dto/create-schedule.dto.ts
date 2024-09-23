import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}
