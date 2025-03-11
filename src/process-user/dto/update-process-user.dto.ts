import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessUserDto } from './create-process-user.dto';

export class UpdateProcessUserDto extends PartialType(CreateProcessUserDto) {}
