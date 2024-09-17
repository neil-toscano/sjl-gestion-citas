import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionTypeDocumentDto } from './create-section-type-document.dto';

export class UpdateSectionTypeDocumentDto extends PartialType(
  CreateSectionTypeDocumentDto,
) {}
