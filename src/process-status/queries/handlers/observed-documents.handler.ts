import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { ObservedDocumentsQuery } from '../observed-documents.query';

@QueryHandler(ObservedDocumentsQuery)
export class ObservedDocumentsHandler
  implements IQueryHandler<ObservedDocumentsQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: ObservedDocumentsQuery) {
    const dateLimit = new Date();
    dateLimit.setHours(dateLimit.getHours() - 48);

    return this.processStatusRepository.getAllUsersWithObservedDocuments();
  }
}
