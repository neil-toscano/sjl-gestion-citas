import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    @IsString()
    @IsOptional()
    fileUrl?: string;
  
    @IsString()
    @IsOptional()
    @IsIn(['EN PROCESO', 'VERIFICADO', 'OBSERVADO'], { message: 'Status must be one of the following values: EN PROCESO, VERIFICADO, OBSERVADO' })
    status?: string;
  
    @IsString()
    @IsOptional()
    details?: string;
}
