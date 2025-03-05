import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessUserService } from './process-user.service';
import { CreateProcessUserDto } from './dto/create-process-user.dto';
import { UpdateProcessUserDto } from './dto/update-process-user.dto';

@Controller('process-user')
export class ProcessUserController {
  constructor(private readonly processUserService: ProcessUserService) {}

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
