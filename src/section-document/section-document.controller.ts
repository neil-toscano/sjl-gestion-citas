import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SectionDocumentService } from './section-document.service';
import { CreateSectionDocumentDto } from './dto/create-section-document.dto';
import { UpdateSectionDocumentDto } from './dto/update-section-document.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('section-document')
export class SectionDocumentController {
  constructor(
    private readonly sectionDocumentService: SectionDocumentService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createSectionDocumentDto: CreateSectionDocumentDto) {
    return this.sectionDocumentService.create(createSectionDocumentDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.sectionDocumentService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionDocumentService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateSectionDocumentDto: UpdateSectionDocumentDto,
  ) {
    return this.sectionDocumentService.update(id, updateSectionDocumentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.sectionDocumentService.remove(id);
  }
}
