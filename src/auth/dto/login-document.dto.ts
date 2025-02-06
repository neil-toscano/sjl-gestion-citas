import {
    ArrayNotEmpty,
    IsArray,
    IsIn,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  
  export class LoginDocumentUserDto {
    @Length(8, 12, { message: 'El documento debe tener entre 8 y 12 dígitos' })
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    documentNumber: string;
  }
  