import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionDocumentService } from './section-document.service';
import { CreateSectionDocumentDto } from './dto/create-section-document.dto';
import { UpdateSectionDocumentDto } from './dto/update-section-document.dto';

@Controller('section-document')
export class SectionDocumentController {
  constructor(
    private readonly sectionDocumentService: SectionDocumentService,
  ) {}

  @Post()
  create(@Body() createSectionDocumentDto: CreateSectionDocumentDto) {
    return this.sectionDocumentService.create(createSectionDocumentDto);
  }

  @Get()
  findAll() {
    return this.sectionDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSectionDocumentDto: UpdateSectionDocumentDto,
  ) {
    return this.sectionDocumentService.update(+id, updateSectionDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionDocumentService.remove(+id);
  }
}
