import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
