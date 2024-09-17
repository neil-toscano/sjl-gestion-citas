import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDocumentDto } from './create-section-document.dto';

export class UpdateSectionDocumentDto extends PartialType(
  CreateSectionDocumentDto,
) {}
