import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(user, createDocumentDto);
  }

  @Get(':id')
  @Auth()
  findBySection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return this.documentsService.findDocumentBySection(id, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Get('valid/:id')
  @Auth()
  validDocuments(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return this.documentsService.hasValidDocuments(id, user);
  }

  @Get('super-user/sections/:id')
  findAllDocumentsByUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.findAllSectionsByUser(id);
  }

}
