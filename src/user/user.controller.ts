import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/decorators';
import { TermDto } from 'src/common/dtos/term.dto';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get('find-term')
  @Auth()
  findByTerm(@Body() termDto: TermDto) {
    return this.userService.findByTerm(termDto);
  }

  @Get('roles/platform-operators')
  @Auth(ValidRoles.admin)
  findPlatformOperators() {
    return this.userService.findPlatformOperators();
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
