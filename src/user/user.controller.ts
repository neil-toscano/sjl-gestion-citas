import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/decorators';
import { TermDto } from 'src/common/dtos/term.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.userService.findAll();
  }

  @Get('find-term')
  @Auth()
  findByTerm(@Body() termDto: TermDto) {
    return this.userService.findByTerm(termDto);
  }

  @Get('roles/admins')
  @Auth()
  findAdmins() {
    return this.userService.findAdmins();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
