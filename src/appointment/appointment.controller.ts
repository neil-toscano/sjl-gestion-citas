import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { FindByWeekDto } from 'src/common/dtos/date.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post(':sectionId/:scheduleId/:adminId')
  @Auth()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
    @Param('sectionId') sectionId: string,
    @Param('scheduleId') scheduleId: string,
    @Param('adminId') adminId: string,
  ) {
    const inputDate = new Date(createAppointmentDto.appointmentDate);
    if (isNaN(inputDate.getTime()) || inputDate.getUTCDay() !== 6) {
      throw new BadRequestException('La fecha debe ser un sábado válido');
    }
    return this.appointmentService.create(
      sectionId,
      scheduleId,
      adminId,
      createAppointmentDto,
      user,
    );
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('week/:adminId')
  @Auth()
  findByWeek(@Param('adminId',  new ParseUUIDPipe()) adminId: string, @Query() query: FindByWeekDto) {
    const inputDate = new Date(query.date);
    if (isNaN(inputDate.getTime()) || inputDate.getUTCDay() !== 6) {
      throw new BadRequestException('La fecha debe ser un sábado válido.');
    }

    return this.appointmentService.findByWeek(inputDate, adminId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id/:sectionId')
  @Auth()
  update(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() updateScheduleDto: UpdateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.update(
      id,
      sectionId,
      updateScheduleDto,
      user,
    );
  }

  @Post('reserve/:id/:sectionId')
  @Auth()
  reserve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.appointmentService.reserveAppointment(id, sectionId, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Get('verify/:id')
  @Auth()
  verifyAppointmentBySection(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.hasOpenAppointmentBySection(id, user.id);
  }
}
