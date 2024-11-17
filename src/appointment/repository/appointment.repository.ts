import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ) {
    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      reservedBy: user,
      section: {
        id: sectionId,
      },
      schedule: {
        id: scheduleId,
      },
    });

    try {
      const newAppointment = await this.appointmentRepository.save(appointment);
      return newAppointment;
    } catch (error) {
      throw new ConflictException(
        'Upss!! alguien ya acaba de usar esa hora, recargue la página',
      );
    }
  }

  async getOpenAppointmentBySectionAndUser(sectionId: string, userId: string) {
    return this.appointmentRepository.findOne({
      where: {
        section: { id: sectionId },
        status: AppointmentStatus.OPEN,
        reservedBy: { id: userId },
      },
      relations: ['schedule'],
    });
  }

  async isScheduleAvailable(
    scheduleId: string,
    date: string,
    sectionId: string,
  ) {
    const appointmentDate = new Date(date);

    const existingAppointments = await this.appointmentRepository.find({
      where: {
        schedule: { id: scheduleId },
        appointmentDate: appointmentDate,
        status: AppointmentStatus.OPEN,
        section: {
          id: sectionId,
        },
      },
    });
    return existingAppointments;
  }
}
