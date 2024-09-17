import { IsUUID } from 'class-validator';

export class CreateSectionTypeDocumentDto {
  @IsUUID()
  sectionId: string;

  @IsUUID()
  typeDocumentId: string;
}
