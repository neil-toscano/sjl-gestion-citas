import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { FindByFilterAppointmentQuery } from '../find-appointment-filter.query';

@QueryHandler(FindByFilterAppointmentQuery)
export class FindByFilterAppointmentHandler
  implements IQueryHandler<FindByFilterAppointmentQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: FindByFilterAppointmentQuery) {
    const { pageSize } = query.filterAppointmentDto;

    const [appointments, totalCount] =
      await this.appointmentRepository.findByFilter(query.filterAppointmentDto);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = appointments.map(({ reservedBy, ...rest }) => {
      const { password, ...reservedByWithoutPassword } = reservedBy || {};
      return {
        ...rest,
        reservedBy: reservedByWithoutPassword,
      };
    });

    return {
      data,
      count: totalCount,
      totalPages,
    };
  }
}
