import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { CreateUserDto } from 'src/auth/dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserByAdminDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];
}
