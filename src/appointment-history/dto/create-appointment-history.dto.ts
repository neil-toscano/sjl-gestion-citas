import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAppointmentHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  sectionId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;
}
