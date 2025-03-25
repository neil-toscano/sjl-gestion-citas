import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { ScheduledProcessQuery } from '../process-scheduled.query';

@QueryHandler(ScheduledProcessQuery)
export class ScheduledProcessHandler
  implements IQueryHandler<ScheduledProcessQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: ScheduledProcessQuery) {
    const { sectionId } = query;
    return this.processStatusRepository.getProcessesByScheduledStatus(sectionId);
  }
}
