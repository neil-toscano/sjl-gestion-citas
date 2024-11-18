import { User } from 'src/user/entities/user.entity';

export class UnresolvedDocumentsQuery {
  constructor(
    public readonly sectionId: string,
    public readonly admin: User,
  ) {}
}
