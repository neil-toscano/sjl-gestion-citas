import { User } from 'src/user/entities/user.entity';

export class NextUserCorrectedDocumentsQuery {
  constructor(
    public readonly sectionId: string,
    public readonly adminId: string,
  ) {}
}
