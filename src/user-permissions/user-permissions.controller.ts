import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createUserPermissionDto: CreateUserPermissionDto) {
    return this.userPermissionsService.create(createUserPermissionDto);
  }

  @Get(':id')
  @Auth()
  findByUser(@Param('id') id: string) {
    return this.userPermissionsService.findByUser(id);
  }

  @Get('platform-operators/:sectionId')
  @Auth()
  findPlatformOperators(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
  ) {
    return this.userPermissionsService.findPlatformOperators(sectionId);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.userPermissionsService.remove(id);
  }
}
