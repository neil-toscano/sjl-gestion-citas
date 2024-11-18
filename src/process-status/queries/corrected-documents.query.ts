import { User } from 'src/user/entities/user.entity';

export class CorrectedDocumentsQuery {
  constructor(
    public readonly sectionId: string,
    public readonly admin: User,
  ) {}
}
