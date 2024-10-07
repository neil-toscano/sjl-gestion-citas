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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('section/documents/:sectionId/:userId')
  @Auth()
  findDocumentBySection(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @GetUser() admin: User,
  ) {
    return this.adminService.findDocumentBySection(sectionId, userId, admin);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Delete('finalize/:userId/:sectionId')
  @Auth()
  finalizeAndRemoveAll(
    @Param('userId') userId: string,
    @Param('sectionId') sectionId: string,
    @GetUser() user: User,
  ) {
    return this.adminService.finalizeAndRemoveAll(userId, sectionId);
  }
}
