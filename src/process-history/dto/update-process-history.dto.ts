import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessHistoryDto } from './create-process-history.dto';

export class UpdateProcessHistoryDto extends PartialType(
  CreateProcessHistoryDto,
) {}
