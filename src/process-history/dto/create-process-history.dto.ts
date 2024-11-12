import {
  IsString,
  IsUUID,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ProcessHistoryStatus } from '../interface/process-history.enum';

export class CreateProcessHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  sectionId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ProcessHistoryStatus)
  @IsNotEmpty()
  state: ProcessHistoryStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
