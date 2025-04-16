import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { ListAllAppointmentQuery } from '../list-all-appointment.query';

@QueryHandler(ListAllAppointmentQuery)
export class ListAllAppointmentHandler
  implements IQueryHandler<ListAllAppointmentQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: ListAllAppointmentQuery) {
    const appointments = await this.appointmentRepository.findAllHistoryAppointment();

    return appointments;
  }
}
