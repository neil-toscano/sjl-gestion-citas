import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ProcessStatusEnum } from "../interfaces/status.enum";

export class CreateProcessStatusDto {

    @IsNotEmpty()
    sectionDocumentId: string;
  
    @IsEnum(ProcessStatusEnum)
    status: ProcessStatusEnum;
}
