import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { FindOneByIdQuery } from '../find-by-id.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindOneByIdQuery)
export class FindOneByIdHandler
  implements IQueryHandler<FindOneByIdQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: FindOneByIdQuery) {
    const { id } = query;
    const processStatus =  this.processStatusRepository.findOneById(id);

    if (!processStatus) {
        throw new NotFoundException(`ProcessStatus with ID ${id} not found`);
      }
  
      return processStatus;
  }
}
