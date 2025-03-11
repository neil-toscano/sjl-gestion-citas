import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { ListAllCompletedStatusQuery } from '../list-all-completed-status.query';

@QueryHandler(ListAllCompletedStatusQuery)
export class ListAllCompletedStatusHandler
  implements IQueryHandler<ListAllCompletedStatusQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute() {
    const completedProcessStatus =
      await this.processStatusRepository.getAllCompletedProcessStatus();

    return completedProcessStatus;
  }
}
