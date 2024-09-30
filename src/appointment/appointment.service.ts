import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
    admin: User,
  ) {
    const section = await this.sectionService.findOne(sectionId);
    const schedule = await this.scheduleService.findOne(scheduleId);
    await this.userService.findOneAdmin(admin.id);

    const { ok, msg } = await this.hasOpenAppointmentBySection(
      sectionId,
      userId,
    );
    if (ok) {
      return {
        ok,
        message: msg,
      };
    }

    await this.isScheduleAvailable(
      scheduleId,
      createAppointmentDto.appointmentDate,
      admin.id,
    );

    const user= await this.userService.findOne(userId);

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
        id: admin.id,
      },
    });
    await this.emailService.sendAppointmentConfirmation({
      appointmentDate: createAppointmentDto.appointmentDate,
      appointmentTime: `${schedule.startTime} - ${schedule.endTime}`,
      email: user.email,
      person: `${admin.firstName} ${admin.lastName} `,
      service: section.sectionName,
      recipientName: `${user.firstName} ${user.lastName}`,
    });

    return this.appointmentRepository.save(appointment);
  }

  findAll(user: User) {
    return this.appointmentRepository.find({
      where: {
        assignedAdmin: {
          id: user.id
        }
      },
      relations: ['section', 'reservedBy', 'schedule'],
      order: {
        appointmentDate: 'ASC',
      },
    });
  }

  async isScheduleAvailable(scheduleId: string, date: string, adminId: string) {
    const appointmentDate = new Date(date);

    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        schedule: { id: scheduleId },
        appointmentDate: appointmentDate,
        assignedAdmin: {
          id: adminId,
        },
      },
    });

    if (existingAppointment) {
      throw new NotFoundException(
        `El horario para dicha fecha ya se encuentra reservada`,
      );
    }

    return true; // Si no hay cita existente, el horario está disponible
  }

  async findByWeek(date: Date, adminId: string): Promise<Appointment[]> {
    await this.userService.findOneAdmin(adminId);
    return this.appointmentRepository.find({
      where: {
        appointmentDate: date,
        assignedAdmin: {
          id: adminId,
        },
      },
      relations: ['section', 'reservedBy', 'schedule'],
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      id: id,
    });

    if (!appointment)
      throw new NotFoundException(`Cita con id ${id} no encontrado`);
    return appointment;
  }

  remove(id:number) {
    return "remove";
  }
  async removeByUser(userId: string, sectionId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        reservedBy: { id: userId },
        section: { id: sectionId },
      },
      relations:['schedule'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrado en la sección');
    }

    await this.appointmentRepository.remove(appointment);
  }

  async removeBySection(userId: string, sectionId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        reservedBy: { id: userId },
        section: { id: sectionId },
      },
      relations:['schedule'],
    });

    if (!appointment) {
      throw new NotFoundException('Ya borró la cita, Intenta actualizar');
    }
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [startHour, startMinute, startSecond] = appointment.schedule.startTime.split(':').map(Number);

    appointmentDateTime.setHours(startHour, startMinute, startSecond);
    const now = new Date();
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / 3600000;

    if (hoursDiff <= 24) {
      throw new BadRequestException('Ya no puede modificar la fecha de la cita ya que quedan menos de 24 horas');
    }

    await this.appointmentRepository.remove(appointment);

    return {
      ok: true,
      msg: 'La cita ha sido eliminado correctamente'
    };
  }

  async hasOpenAppointmentBySection(sectionId: string, userId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        section: {
          id: sectionId,
        },
        status: AppointmentStatus.PENDING,
        reservedBy: {
          id: userId,
        },
      },
      relations: ['schedule'],
    });

    return appointment === null
      ? {
          ok: false,
          msg: 'Aún no tiene reservaciones en la sección',
        }
      : {
          ok: true,
          msg: 'Ya tiene reserva en la sección',
          appointment,
        };
  }
  async expiredAppointments() {
    const date = new Date();
  const limaOffset = -5; // Lima es UTC-5
  const currentLimaTime = new Date(date.getTime() + limaOffset * 60 * 60 * 1000);


  const appointments = await this.appointmentRepository
  .createQueryBuilder('appointment')
  .where('appointment.appointmentDate < :currentTime', { currentTime: currentLimaTime })
  .leftJoinAndSelect('appointment.reservedBy', 'user')
  .leftJoinAndSelect('appointment.section', 'section')
  .getMany();

  return appointments;
  }
  
}
