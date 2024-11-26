import {
  Controller,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('section/documents/:sectionId/:userId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findDocumentBySection(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @GetUser() admin: User,
  ) {
    return this.adminService.findDocumentBySection(sectionId, userId, admin);
  }

  @Delete('finalize/:userId/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  finalizeAndRemoveAll(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.adminService.finalizeAndRemoveAll(userId, sectionId);
  }

  @Delete('remove-documents/:userId/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  removeDocuments(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.adminService.removeDocuments(userId, sectionId);
  }

  @Patch('update-user/:id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserByAdminDto) {
    return this.adminService.updateUserByAdmin(id, updateUserDto);
  }
}
