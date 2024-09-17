import { IsString, MaxLength } from 'class-validator';

export class CreateTypeDocumentDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
