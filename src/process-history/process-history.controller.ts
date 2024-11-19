import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProcessHistoryService } from './process-history.service';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { FilterProcessHistoryDto } from './dto/filter-process-history.dto';

@Controller('process-history')
export class ProcessHistoryController {
  constructor(private readonly processHistoryService: ProcessHistoryService) {}

  @Post()
  @Auth()
  create(
    @Body() createProcessHistoryDto: CreateProcessHistoryDto,
    @GetUser() platformUser: User,
  ) {
    return this.processHistoryService.create(
      platformUser,
      createProcessHistoryDto,
    );
  }

  @Get()
  @Auth()
  findAll(@Query() filterProcessHistoryDto: FilterProcessHistoryDto) {
    return this.processHistoryService.findAll(filterProcessHistoryDto);
  }
}
