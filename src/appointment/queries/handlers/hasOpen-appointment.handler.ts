import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HasOpenAppointmentQuery } from '../hasOpen-appointment.query';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';

@QueryHandler(HasOpenAppointmentQuery)
export class HasOpenAppointmentHandler
  implements IQueryHandler<HasOpenAppointmentQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: HasOpenAppointmentQuery) {
    const { sectionId, userId } = query;

    const appointment =
      await this.appointmentRepository.getOpenAppointmentBySectionAndUser(
        sectionId,
        userId,
      );

    return appointment === null
      ? {
          ok: false,
          msg: 'Aún no tiene reservaciones en la sección',
        }
      : {
          ok: true,
          msg: 'Ya tiene reserva en la sección',
          appointment,
        };
  }
}
