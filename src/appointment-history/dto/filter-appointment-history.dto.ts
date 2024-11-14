import { IsOptional, IsDateString, IsUUID } from 'class-validator';

export class FilterAppointmentHistoryDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;
}
