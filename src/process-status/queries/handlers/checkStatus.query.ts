import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { CheckStatusQuery } from '../checkStatus.query';

@QueryHandler(CheckStatusQuery)
export class CheackStatusHandler implements IQueryHandler<CheckStatusQuery> {
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: CheckStatusQuery) {
    const { sectionId, userId } = query;
    return this.processStatusRepository.checkStatus(sectionId, userId);
  }
}
