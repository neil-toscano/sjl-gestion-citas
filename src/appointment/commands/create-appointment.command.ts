import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

export class CreateAppointmentCommand {
  constructor(
    public readonly sectionId: string,
    public readonly scheduleId: string,
    public readonly createAppointmentDto: CreateAppointmentDto,
    public readonly user: User,
  ) {}
}
