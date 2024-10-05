import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessStatusDto } from './create-process-status.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProcessStatusDto extends PartialType(CreateProcessStatusDto) {
}
