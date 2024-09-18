import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSectionDocumentDto {
  @IsString()
  @IsNotEmpty()
  sectionName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sectionSlug?: string;
}
