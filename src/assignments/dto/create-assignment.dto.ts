import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AssignmentStatus } from '../entities/assignment.entity';

export class CreateAssignmentDto {
  @IsUUID()
  userId: string;
  
  @IsUUID()
  adminId: string;

  @IsUUID()
  sectionDocumentId: string;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus = AssignmentStatus.PENDING;
}
