import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionTypeDocumentService } from './section-type-document.service';
import { CreateSectionTypeDocumentDto } from './dto/create-section-type-document.dto';
import { UpdateSectionTypeDocumentDto } from './dto/update-section-type-document.dto';
import { Auth } from 'src/auth/decorators';

@Controller('section-type-document')
export class SectionTypeDocumentController {
  constructor(
    private readonly sectionTypeDocumentService: SectionTypeDocumentService,
  ) {}

  @Post()
  create(@Body() createSectionTypeDocumentDto: CreateSectionTypeDocumentDto) {
    return this.sectionTypeDocumentService.create(createSectionTypeDocumentDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.sectionTypeDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionTypeDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSectionTypeDocumentDto: UpdateSectionTypeDocumentDto,
  ) {
    return this.sectionTypeDocumentService.update(
      +id,
      updateSectionTypeDocumentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionTypeDocumentService.remove(+id);
  }
}
