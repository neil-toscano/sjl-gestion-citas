import { User } from 'src/user/entities/user.entity';

export class ListAppointmentQuery {
  constructor(
    public readonly user: User,
    public readonly sectionId: string,
  ) {}
}
