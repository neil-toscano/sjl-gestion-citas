import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ScheduleService } from 'src/schedule/schedule.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    adminId: string,
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ) {
    await this.sectionService.findOne(sectionId);
    await this.scheduleService.findOne(scheduleId);
    await this.userService.findOneAdmin(adminId);

    const { ok, msg } = await this.hasOpenAppointmentBySection(
      sectionId,
      user.id,
    );
    if (ok) {
      return {
        ok,
        message: msg,
      };
    }

    await this.isScheduleAvailable(scheduleId, createAppointmentDto.appointmentDate, adminId)

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      reservedBy: user,
      section: {
        id: sectionId,
      },
      schedule: {
        id: scheduleId,
      },
      assignedAdmin: {
        id: adminId,
      }
    });
    return this.appointmentRepository.save(appointment);
  }

  findAll() {
    return this.appointmentRepository.find();
  }
  
  async isScheduleAvailable(scheduleId: string, date: string, adminId: string) {
    const appointmentDate = new Date(date);
    
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        schedule: { id: scheduleId },
        appointmentDate: appointmentDate,
        assignedAdmin: {
          id: adminId,
          }
      },
    });
  
    if (existingAppointment) {
      throw new NotFoundException(`The schedule is already booked for this admin`);
    }
  
    return true;  // Si no hay cita existente, el horario está disponible
  }
  

  async findByWeek(date: Date, adminId:string): Promise<Appointment[]> {

    return this.appointmentRepository.find({
      where: {
        appointmentDate: date,
        assignedAdmin: {
          id: adminId,
        }
      },
      relations: ['section', 'reservedBy', 'schedule'], 
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      id: id,
    });

    if (!appointment)
      throw new NotFoundException(`schedule with id ${id} not found`);
    return appointment;
  }

  async update(
    id: string,
    sectionId: string,
    updateScheduleDto: UpdateAppointmentDto,
    user: User,
  ) {
    await this.appointmentRepository.update(id, {
      ...updateScheduleDto,
      reservedBy: user,
      section: {
        id: sectionId,
      },
    });

    return this.appointmentRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  async reserveAppointment(id: string, sectionId: string, user: User) {
    const appointment = await this.findOne(id);
    await this.sectionService.findOne(sectionId);

    // if (!appointment.isAvailable) {
    //   throw new NotFoundException(`Horario no disponible`);
    // }

    const { ok, msg } = await this.hasOpenAppointmentBySection(
      sectionId,
      user.id,
    );
    if (ok) {
      return {
        ok,
        message: msg,
      };
    }

    await this.appointmentRepository.update(id, {
      reservedBy: user,
      section: {
        id: sectionId,
      },
    });

    return this.appointmentRepository.findOneBy({ id });
  }

  async hasOpenAppointmentBySection(sectionId: string, userId: string) {
    const schedule = await this.appointmentRepository.findOne({
      where: {
        section: {
          id: sectionId,
        },
        status: AppointmentStatus.PENDING,
        reservedBy: {
          id: userId,
        },
      },
    });

    return schedule === null
      ? {
          ok: false,
          msg: 'Aún no tiene reservaciones en la sección',
        }
      : {
          ok: true,
          msg: 'Ya tiene reserva en la sección',
          schedule,
        };
  }
}
