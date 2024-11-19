import { Controller, Get, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('section/documents/:sectionId/:userId')
  @Auth()
  findDocumentBySection(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @GetUser() admin: User,
  ) {
    return this.adminService.findDocumentBySection(sectionId, userId, admin);
  }

  @Delete('finalize/:userId/:sectionId')
  @Auth()
  finalizeAndRemoveAll(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.adminService.finalizeAndRemoveAll(userId, sectionId);
  }

  @Delete('remove-documents/:userId/:sectionId')
  @Auth(ValidRoles.superUser)
  removeDocuments(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.adminService.removeDocuments(userId, sectionId);
  }
}
