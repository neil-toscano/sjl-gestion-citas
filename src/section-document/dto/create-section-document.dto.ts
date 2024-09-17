import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectionDocumentDto {
  @IsString()
  @IsNotEmpty()
  sectionName: string;
}
