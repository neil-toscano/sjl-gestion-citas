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
import { ValidRoles } from 'src/auth/interfaces';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(user, createDocumentDto);
  }

  @Get('section/:sectionId')
  @Auth()
  findBySection(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.documentsService.findBySection(sectionId, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Patch('admin/:id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  updateByAdmin(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateByAdmin(id, updateDocumentDto);
  }
}
