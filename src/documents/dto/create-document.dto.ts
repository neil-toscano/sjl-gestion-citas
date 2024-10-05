import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsOptional,
} from 'class-validator';
export class CreateDocumentDto {
  @IsUUID()
  sectionId: string;

  @IsUUID()
  typeDocumentId: string; 

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['EN PROCESO', 'VERIFICADO', 'OBSERVADO'], {
    message:
      'El estado debe ser uno de los siguientes: EN PROCESO, VERIFICADO, OBSERVADO',
  })
  status: string;

  @IsString()
  @IsOptional()
  details?: string;
}
