import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessStatusService } from './process-status.service';
import { CreateProcessStatusDto } from './dto/create-process-status.dto';
import { UpdateProcessStatusDto } from './dto/update-process-status.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('process-status')
export class ProcessStatusController {
  constructor(private readonly processStatusService: ProcessStatusService) {}

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createProcessStatusDto: CreateProcessStatusDto) {
    return this.processStatusService.create(createProcessStatusDto, user);
  }

  @Get()
  findAll() {
    return this.processStatusService.findAll();
  }

  @Get(':id')
  @Auth()
  findOneByUserSection(@Param('id') sectionId: string, @GetUser() user: User,) {
    return this.processStatusService.findOneByUserSection(sectionId,user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProcessStatusDto: UpdateProcessStatusDto) {
    return this.processStatusService.update(id, updateProcessStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processStatusService.remove(id);
  }
}
