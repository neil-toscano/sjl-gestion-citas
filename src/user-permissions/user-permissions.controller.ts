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
import { UserPermissionsService } from './user-permissions.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { Auth } from 'src/auth/decorators';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Post()
  @Auth()
  create(@Body() createUserPermissionDto: CreateUserPermissionDto) {
    return this.userPermissionsService.create(createUserPermissionDto);
  }

  @Get()
  findAll() {
    return this.userPermissionsService.findAll();
  }

  @Get(':id')
  @Auth()
  findByUser(@Param('id') id: string) {
    return this.userPermissionsService.findByUser(id);
  }

  @Get('platform-operators/:sectionId')
  @Auth()
  findPlatformOperators(@Param('sectionId', new ParseUUIDPipe()) sectionId: string) {
    return this.userPermissionsService.findPlatformOperators(sectionId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPermissionDto: UpdateUserPermissionDto,
  ) {
    return this.userPermissionsService.update(+id, updateUserPermissionDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.userPermissionsService.remove(id);
  }
}
