import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsString()
  @MaxLength(500, {
    message: 'El mensaje solo puede tener un máximo de 500 caracteres',
  })
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  message: string;
}
