import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsBoolean, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
