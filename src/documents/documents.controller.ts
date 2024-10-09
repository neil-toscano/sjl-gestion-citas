import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { PermissionGuard } from 'src/auth/guards/user-permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions-protected.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions';

@Controller('documents')
// @UseGuards(PermissionGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(user, createDocumentDto);
  }

  @Get('section/:sectionId')
  @Auth()
  // @Permissions(ValidPermissions.lotes)
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
    @GetUser() user: User,
  ) {
    return this.documentsService.update(id, updateDocumentDto, user);
  }
}
