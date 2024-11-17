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
import { ValidRoles } from 'src/auth/interfaces';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post(':sectionId/:scheduleId')
  @Auth()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
  ) {
    const inputDate = new Date(createAppointmentDto.appointmentDate);
    if (isNaN(inputDate.getTime()) || inputDate.getUTCDay() !== 6) {
      throw new BadRequestException('La fecha debe ser un sábado válido');
    }

    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < currentDate) {
      throw new BadRequestException(
        'La fecha de la cita debe ser mayor o igual a la fecha actual.',
      );
    }

    return this.appointmentService.create(
      sectionId,
      scheduleId,
      createAppointmentDto,
      user,
    );
  }

  @Get('section/:id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findAll(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) sectionId: string,
  ) {
    return this.appointmentService.findAll(user, sectionId);
  }

  @Get('filter')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findByFilter(@Query() filterAppointmentDto: FilterAppointmentDto) {
    return this.appointmentService.findByFilter(filterAppointmentDto);
  }

  @Get('week/:sectionId')
  @Auth()
  findByWeek(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Query() query: FindByWeekDto,
  ) {
    const inputDate = new Date(query.date);
    if (isNaN(inputDate.getTime()) || inputDate.getUTCDay() !== 6) {
      throw new BadRequestException('La fecha debe ser un sábado válido.');
    }

    return this.appointmentService.findByWeek(inputDate, sectionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete('section/:sectionId/:userId')
  @Auth()
  removeBySection(
    @Param('sectionId') sectionId: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.appointmentService.removeBySection(userId, sectionId);
  }

  @Get('verify/:id')
  @Auth()
  verifyAppointmentBySection(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.hasOpenAppointmentBySection(id, user.id);
  }
}
