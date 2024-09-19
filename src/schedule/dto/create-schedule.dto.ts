import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ScheduleStatus } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsEnum(ScheduleStatus)
  @IsOptional()
  status?: ScheduleStatus;

  @IsBoolean()
  isAvailable: boolean;
}
