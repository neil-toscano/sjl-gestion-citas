import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsOptional,
} from 'class-validator';
export class CreateDocumentDto {
  @IsUUID()
  sectionTypeId: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['EN PROCESO', 'VERIFICADO', 'OBSERVADO'], {
    message:
      'Status must be one of the following values: EN PROCESO, VERIFICADO, OBSERVADO',
  })
  status: string;

  @IsString()
  @IsOptional()
  details?: string;
}
