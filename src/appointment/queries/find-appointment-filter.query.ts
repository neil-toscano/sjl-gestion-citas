import { FilterAppointmentDto } from '../dto/filter-appointment.dto';

export class FindByFilterAppointmentQuery {
  constructor(public readonly filterAppointmentDto: FilterAppointmentDto) {}
}
