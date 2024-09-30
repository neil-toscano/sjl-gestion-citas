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

  @Post(':sectionId/:scheduleId/:userId')
  @Auth()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() admin: User,
    @Param('sectionId') sectionId: string,
    @Param('scheduleId') scheduleId: string,
    @Param('userId') userId: string,
  ) {
    const inputDate = new Date(createAppointmentDto.appointmentDate);
    if (isNaN(inputDate.getTime()) || inputDate.getUTCDay() !== 6) {
      throw new BadRequestException('La fecha debe ser un sábado válido');
    }

    const currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < currentDate) {
      throw new BadRequestException('La fecha de la cita debe ser mayor o igual a la fecha actual.');
    }


    return this.appointmentService.create(
      sectionId,
      scheduleId,
      userId,
      createAppointmentDto,
      admin,
    );
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.appointmentService.findAll(user);
  }

  @Get('week/:adminId')
  @Auth()
  findByWeek(
    @Param('adminId', new ParseUUIDPipe()) adminId: string,
    @Query() query: FindByWeekDto,
  ) {
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Delete('section/:id')
  @Auth()
  removeBySection(@Param('id') sectionId: string, @GetUser() user: User,) {
    return this.appointmentService.removeBySection(user.id,  sectionId);
  }

  @Get('verify/:id')
  @Auth()
  verifyAppointmentBySection(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.hasOpenAppointmentBySection(id, user.id);
  }
}
