import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { UpdateAppointmentCommand } from '../update-appointment.command';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateAppointmentCommand)
export class UpdateAppointmentHandler
  implements ICommandHandler<UpdateAppointmentCommand>
{
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(command: UpdateAppointmentCommand) {
    const { id, updateAppointmentDto } = command;

    delete updateAppointmentDto.isFirstTime;

    if (Object.keys(updateAppointmentDto).length === 0) {
      throw new BadRequestException('Campos no encontrado para actualizar');
    }

    const appointment = await this.appointmentRepository.update(
      id,
      updateAppointmentDto,
    );
    return await this.appointmentRepository.findOneById(id);
  }
}
