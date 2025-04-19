import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSectionDocumentDto {
  @IsString()
  @IsNotEmpty()
  sectionName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sectionSlug?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredDocumentsCount?: number;
}
