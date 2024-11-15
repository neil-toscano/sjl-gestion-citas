import { IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppointmentStatus } from '../entities/appointment.entity';

export class FilterAppointmentDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;
  
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: `status must be one of: ${Object.values(AppointmentStatus).join(', ')}`,
  })
  status?: AppointmentStatus;
}

