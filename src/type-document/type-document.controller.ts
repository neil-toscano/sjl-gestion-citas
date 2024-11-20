import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeDocumentService } from './type-document.service';
import { CreateTypeDocumentDto } from './dto/create-type-document.dto';
import { UpdateTypeDocumentDto } from './dto/update-type-document.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('type-document')
export class TypeDocumentController {
  constructor(private readonly typeDocumentService: TypeDocumentService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createTypeDocumentDto: CreateTypeDocumentDto) {
    return this.typeDocumentService.create(createTypeDocumentDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.typeDocumentService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.typeDocumentService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateTypeDocumentDto: UpdateTypeDocumentDto,
  ) {
    return this.typeDocumentService.update(id, updateTypeDocumentDto);
  }
}
