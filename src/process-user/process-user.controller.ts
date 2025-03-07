import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessUserService } from './process-user.service';
import { CreateProcessUserDto } from './dto/create-process-user.dto';
import { UpdateProcessUserDto } from './dto/update-process-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('process-user')
export class ProcessUserController {
  constructor(private readonly processUserService: ProcessUserService) { }

  @Post()
  create(@Body() createProcessUserDto: CreateProcessUserDto) {
    return this.processUserService.create(createProcessUserDto);
  }

  @Get()
  findAll() {
    return this.processUserService.findAll();
  }

  @Get('history')
  findAllHistory() {
    return this.processUserService.findAllHistory();
  }
  
  @Get('cantidad-asignados')
  findAllAsignados() {
    return this.processUserService.findAllAsignados();
  }

  @Get('new-assigned/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findNewAssigned(
    @Param('sectionId') sectionId: string,
    @GetUser() user: User,
  ) {
    return this.processUserService.findAllNewAssigned(sectionId, user);
  }

  @Get('corrected/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findCorrectedUsers(
    @Param('sectionId') sectionId: string,
    @GetUser() user: User,
  ) {
    return this.processUserService.findAllCorrected(sectionId, user);
  }

  @Get('unresolved-documents/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findUnresolvedUsers(
    @Param('sectionId') sectionId: string,
    @GetUser() user: User,
  ) {
    return this.processUserService.findAllUnresolved(sectionId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProcessUserDto: UpdateProcessUserDto) {
    return this.processUserService.update(+id, updateProcessUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processUserService.remove(id);
  }
}
