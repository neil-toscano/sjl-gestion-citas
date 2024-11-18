import { UpdateProcessStatusDto } from '../dto/update-process-status.dto';

export class UpdateProcessStatusCommand {
  constructor(
    public readonly id: string,
    public readonly updateProcessStatusDto: UpdateProcessStatusDto,
  ) {}
}
