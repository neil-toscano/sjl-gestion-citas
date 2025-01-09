import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    @IsBoolean()
    @IsOptional()
    isRescheduled?: boolean;
}
