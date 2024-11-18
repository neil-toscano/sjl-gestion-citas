import { User } from 'src/user/entities/user.entity';

export class FindOneByUserSectionQuery {
  constructor(
    public readonly sectionId: string,
    public readonly user: User,
    public readonly throwErrorIfNotFound: boolean,
  ) {}
}
