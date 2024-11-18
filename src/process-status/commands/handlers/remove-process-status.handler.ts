import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProcessStatusCommand } from '../remove-process-status.command';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';

@CommandHandler(RemoveProcessStatusCommand)
export class RemoveProcessStatusHandler
  implements ICommandHandler<RemoveProcessStatusCommand>
{
  constructor(private processStatusRepository: ProcessStatusRepository) {}

  async execute(command: RemoveProcessStatusCommand) {
    const { id } = command;

    return await this.processStatusRepository.remove(id);
  }
}
