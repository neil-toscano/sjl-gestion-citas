import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { ListAppointmentQuery } from '../list-appointment.query';

@QueryHandler(ListAppointmentQuery)
export class ListAppointmentHandler
  implements IQueryHandler<ListAppointmentQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: ListAppointmentQuery) {
    const { sectionId, user } = query;

    const appointments = await this.appointmentRepository.findAll(
      user,
      sectionId,
    );

    return appointments;
  }
}
