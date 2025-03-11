import { IsUUID, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateProcessUserDto {
  @IsUUID()
  @IsNotEmpty()
  processStatusId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}