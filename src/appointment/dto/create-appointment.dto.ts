import {
  IsUUID,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsOptional,
  IsISO8601,
  Matches,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  appointmentDate: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status: AppointmentStatus;

  @IsBoolean()
  @IsOptional()
  isFirstTime: boolean = true;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'El mensaje solo puede tener un máximo de 500 caracteres',
  })
  message?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}
