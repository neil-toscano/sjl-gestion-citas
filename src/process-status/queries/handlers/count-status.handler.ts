import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { CountByStatusQuery } from '../count-status.query';

@QueryHandler(CountByStatusQuery)
export class CountByStatusHandler implements IQueryHandler<CountByStatusQuery> {
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: CountByStatusQuery) {
    return this.processStatusRepository.countByStatus();
  }
}
