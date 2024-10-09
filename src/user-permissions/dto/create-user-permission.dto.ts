import {  IsNotEmpty, IsUUID } from 'class-validator';
export class CreateUserPermissionDto {

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  sectionId: string;

}
