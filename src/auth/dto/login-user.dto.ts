import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @Length(8, 12, { message: 'El documento debe tener entre 8 y 12 dígitos' })
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  documentNumber: string;

  @IsString({ message: 'Debe ser un string' })
  @Length(5, 5, {
    message: 'La contraseña debe tener exactamente 5 caracteres',
  })
  password: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(['user', 'platform-operator', 'administrator'], {
    each: true,
    message:
      'El rol debe ser uno de los siguientes: user, platform-operator, administrator',
  })
  roles?: string[] = ['user'];
}
