import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

export class UpdateAppointmentCommand {
  constructor(
    public readonly id: string,
    public readonly updateAppointmentDto: UpdateAppointmentDto,
  ) {}
}
