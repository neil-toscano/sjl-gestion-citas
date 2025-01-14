import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProcessStatusCommand } from '../remove-process-status.command';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { UpdateProcessStatusCommand } from '../updated-process-status.command';

@CommandHandler(UpdateProcessStatusCommand)
export class UpdateProcessStatusHandler
  implements ICommandHandler<UpdateProcessStatusCommand>
{
  constructor(private processStatusRepository: ProcessStatusRepository) {}

  async execute(command: UpdateProcessStatusCommand) {
    const { id, updateProcessStatusDto } = command;

    const processStatus = await this.processStatusRepository.findOneById(id);

    if (!processStatus) {
      throw new Error('Proceso no encontrado');
    }
    const process = await this.processStatusRepository.update(
      id,
      updateProcessStatusDto,
    );

    return this.processStatusRepository.findOneById(id);
  }
}
