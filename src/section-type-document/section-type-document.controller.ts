import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SectionTypeDocumentService } from './section-type-document.service';
import { CreateSectionTypeDocumentDto } from './dto/create-section-type-document.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('section-type-document')
export class SectionTypeDocumentController {
  constructor(
    private readonly sectionTypeDocumentService: SectionTypeDocumentService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createSectionTypeDocumentDto: CreateSectionTypeDocumentDto) {
    return this.sectionTypeDocumentService.create(createSectionTypeDocumentDto);
  }

  
  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.sectionTypeDocumentService.findAll(user);
  }
  
  @Get('by-user')
  @Auth()
  findByAssignedUser(@GetUser() user: User) {
    return this.sectionTypeDocumentService.findByAssignedUser(user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionTypeDocumentService.findOne(id);
  }
}
