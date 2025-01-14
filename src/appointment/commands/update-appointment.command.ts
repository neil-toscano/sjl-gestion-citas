import { User } from 'src/user/entities/user.entity';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

export class UpdateAppointmentCommand {
  constructor(
    public readonly id: string,
    public readonly updateAppointmentDto: UpdateAppointmentDto,
    public readonly user: User,
  ) {}
}
