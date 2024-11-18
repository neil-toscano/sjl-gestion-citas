import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { FindOneByUserSectionQuery } from '../find-by-user.query';

@QueryHandler(FindOneByUserSectionQuery)
export class UnresolvedDocumentsHandler
  implements IQueryHandler<FindOneByUserSectionQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: FindOneByUserSectionQuery) {
    const { sectionId, user, throwErrorIfNotFound } = query;
    return this.processStatusRepository.findOneByUserSection(
      sectionId,
      user,
      throwErrorIfNotFound,
    );
  }
}
