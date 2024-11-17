import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { FindOneAppointmentQuery } from '../find-one.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindOneAppointmentQuery)
export class FindOneAppointmentHandler
  implements IQueryHandler<FindOneAppointmentQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(query: FindOneAppointmentQuery) {
    const { id } = query;

    const appointment = await this.appointmentRepository.findOneById(id);

    if (!appointment)
      throw new NotFoundException(`Cita con id ${id} no encontrado`);
    return appointment;
  }
}
