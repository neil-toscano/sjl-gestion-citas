import { User } from 'src/user/entities/user.entity';

export class CheckEligibilityQuery {
  constructor(
    public readonly sectionId: string,
    public readonly user: User,
  ) {}
}
