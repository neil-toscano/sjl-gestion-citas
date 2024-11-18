import { User } from 'src/user/entities/user.entity';

export class ListCompletedStatusQuery {
  constructor(
    public readonly admin: User,
    public readonly sectionId: string,
  ) {}
}
