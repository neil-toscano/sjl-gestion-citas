import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class CreateSectionDocumentDto {
  @IsString()
  @IsNotEmpty()
  sectionName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sectionSlug?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredDocumentsCount?: number;
}
