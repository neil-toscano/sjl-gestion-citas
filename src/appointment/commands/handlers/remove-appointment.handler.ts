import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAppointmentCommand } from '../remove-appointment.command';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { AppointmentStatus } from 'src/appointment/entities/appointment.entity';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(RemoveAppointmentCommand)
export class RemoveAppointmentHandler
  implements ICommandHandler<RemoveAppointmentCommand>
{
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(command: RemoveAppointmentCommand) {
    const { sectionId, userId } = command;

    const appointment = await this.appointmentRepository.findOneByFilter({
      reservedBy: { id: userId },
      section: { id: sectionId },
      status: AppointmentStatus.OPEN,
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrado en la sección');
    }

    return await this.appointmentRepository.update(appointment.id, {
      status: AppointmentStatus.CLOSED,
    });
  }
}
