import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum DocumentStatus {
  EN_PROCESO = 'EN PROCESO',
  VERIFICADO = 'VERIFICADO',
  OBSERVADO = 'OBSERVADO',
}
export class CreateDocumentDto {
  @IsUUID()
  sectionId: string;

  @IsUUID()
  typeDocumentId: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsEnum(DocumentStatus, {
    message:
      'El estado debe ser uno de los siguientes: EN PROCESO, VERIFICADO, OBSERVADO',
  })
  status: DocumentStatus;

  @IsString()
  @IsOptional()
  details?: string;
}
