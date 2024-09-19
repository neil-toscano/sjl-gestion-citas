import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from 'src/user/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id/:sectionId')
  @Auth()
  update(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @GetUser() user: User,
  ) {
    return this.scheduleService.update(id, sectionId, updateScheduleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }

  @Post('reserve/:id/:sectionId')
  @Auth()
  reserve(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @GetUser() user: User,
  ) {
    return this.scheduleService.reserveSchedule(id, sectionId, user);
  }
  
  @Get('verify/:id')
  @Auth()
  verifySchedule(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.scheduleService.hasOpenScheduleSection(id, user.id);
  }
}
