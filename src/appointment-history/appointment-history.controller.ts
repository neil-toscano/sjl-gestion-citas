import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './dto/create-appointment-history.dto';
import { UpdateAppointmentHistoryDto } from './dto/update-appointment-history.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

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
  findAll() {
    return this.appointmentHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentHistoryDto: UpdateAppointmentHistoryDto,
  ) {
    return this.appointmentHistoryService.update(
      +id,
      updateAppointmentHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentHistoryService.remove(+id);
  }
}
