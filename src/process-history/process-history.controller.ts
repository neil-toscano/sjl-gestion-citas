import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProcessHistoryService } from './process-history.service';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { UpdateProcessHistoryDto } from './dto/update-process-history.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
  findAll(
    @Query() paginationDto: PaginationDto,
    @Body() filterProcessHistoryDto: FilterProcessHistoryDto,
  ) {
    return this.processHistoryService.findAll(
      paginationDto,
      filterProcessHistoryDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcessHistoryDto: UpdateProcessHistoryDto,
  ) {
    return this.processHistoryService.update(+id, updateProcessHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processHistoryService.remove(+id);
  }
}
