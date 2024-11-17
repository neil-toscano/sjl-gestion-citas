import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { ListExpiredAppointmentsQuery } from '../list-expired-appointments.query';

@QueryHandler(ListExpiredAppointmentsQuery)
export class ListExpiredAppointmentsHandler
  implements IQueryHandler<ListExpiredAppointmentsQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: ListExpiredAppointmentsQuery) {
    const date = new Date();
    const limaOffset = -5; // Lima es UTC-5
    const currentLimaTime = new Date(
      date.getTime() + limaOffset * 60 * 60 * 1000,
    );
    const appointments =
      await this.appointmentRepository.getExpiredAppointments(currentLimaTime);

    return appointments;
  }
}
