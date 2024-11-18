import { User } from 'src/user/entities/user.entity';
import { CreateProcessStatusDto } from '../dto/create-process-status.dto';

export class CreateProcessStatusCommand {
  constructor(
    public readonly createProcessStatusDto: CreateProcessStatusDto,
    public readonly user: User,
  ) {}
}
