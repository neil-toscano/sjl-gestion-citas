import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './dto/create-appointment-history.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { FilterAppointmentHistoryDto } from './dto/filter-appointment-history.dto';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('appointment-history')
export class AppointmentHistoryController {
  constructor(
    private readonly appointmentHistoryService: AppointmentHistoryService,
  ) {}

  @Post()
  @Auth()
  create(
    @Body() createAppointmentHistoryDto: CreateAppointmentHistoryDto,
    @GetUser() platformUser: User,
  ) {
    return this.appointmentHistoryService.create(
      platformUser,
      createAppointmentHistoryDto,
    );
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() filterProcessHistoryDto: FilterAppointmentHistoryDto) {
    return this.appointmentHistoryService.findAll(filterProcessHistoryDto);
  }
}
