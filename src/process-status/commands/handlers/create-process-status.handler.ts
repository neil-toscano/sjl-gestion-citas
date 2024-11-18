import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { CreateProcessStatusCommand } from '../create-process-status.command';

@CommandHandler(CreateProcessStatusCommand)
export class CreateProcessStatusHandler
  implements ICommandHandler<CreateProcessStatusCommand>
{
  constructor(private processStatusRepository: ProcessStatusRepository) {}

  async execute(command: CreateProcessStatusCommand) {
    const { createProcessStatusDto, user } = command;

    return this.processStatusRepository.create(createProcessStatusDto, user);
  }
}
