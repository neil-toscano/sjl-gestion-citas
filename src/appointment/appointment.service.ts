import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { ProcessStatusEnum } from 'src/process-status/interfaces/status.enum';
import { UserPermissionsService } from 'src/user-permissions/user-permissions.service';
import { EstadoDisponibilidad } from './interfaces/availability.enum';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly emailService: EmailService,
    private readonly processStatusService: ProcessStatusService,
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ) {
    const checkEligibility =
      await this.processStatusService.checkEligibilityForAppointment(
        sectionId,
        user,
      );
    if (!checkEligibility.hasProcess) {
      throw new NotFoundException('No tiene ningún proceso');
    }

    // if (!checkEligibility.timeRemaining.expired) {
    //   throw new BadRequestException('Aún no cumple la fecha para sacar cita.');
    // }

    const section = await this.sectionService.findOne(sectionId);
    const schedule = await this.scheduleService.findOne(scheduleId);

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

    const platformOperatorsCount =
      await this.userPermissionsService.findPlatformOperators(sectionId);

    await this.isScheduleAvailable(
      scheduleId,
      createAppointmentDto.appointmentDate,
      platformOperatorsCount.length,
    );

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

    const processStatus = await this.processStatusService.findOneByUserSection(
      sectionId,
      user,
      true,
    );

    await this.processStatusService.update(processStatus.id, {
      status: ProcessStatusEnum.APPOINTMENT_SCHEDULED,
    });

    await this.emailService.sendAppointmentConfirmation({
      isFirstTime: createAppointmentDto.isFirstTime,
      appointmentDate: createAppointmentDto.appointmentDate,
      appointmentTime: `${schedule.startTime} - ${schedule.endTime}`,
      email: user.email,
      person: `PERSONAL DE LA MUNICIPALIDAD `,
      service: section.sectionName,
      recipientName: `${user.firstName} ${user.apellido_paterno}`,
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

  findAll(user: User, sectionId: string) {
    return this.appointmentRepository.find({
      where: {
        section: {
          id: sectionId,
        },
        status: AppointmentStatus.OPEN,
      },
      relations: ['section', 'reservedBy', 'schedule'],
      order: {
        appointmentDate: 'ASC',
      },
    });
  }
  
  async findByFilter(filterAppointmentDto: FilterAppointmentDto) {
    const { pageSize = 25, page = 0, fromDate, toDate, sectionId, status } = filterAppointmentDto;
    const offset = pageSize * page;
  
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment');
  
    queryBuilder
      .leftJoinAndSelect('appointment.section', 'section')
      .leftJoinAndSelect('appointment.reservedBy', 'reservedBy')
      .leftJoinAndSelect('appointment.schedule', 'schedule');
  
    if (sectionId) {
      queryBuilder.andWhere('section.id = :sectionId', { sectionId });
    }
  
    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }
  
    if (fromDate) {
      queryBuilder.andWhere('appointment.appointmentDate >= :fromDate', { fromDate });
    }
  
    if (toDate) {
      queryBuilder.andWhere('appointment.appointmentDate <= :toDate', { toDate });
    }
  
    queryBuilder.take(pageSize).skip(offset);
  
    queryBuilder.orderBy('appointment.appointmentDate', 'ASC');
  
    const [appointments, totalCount] = await queryBuilder.getManyAndCount();
  
    const totalPages = Math.ceil(totalCount / pageSize);
  
    const data = appointments.map(({ reservedBy, ...rest }) => {
      const { password, ...reservedByWithoutPassword } = reservedBy || {};
      return {
        ...rest,
        reservedBy: reservedByWithoutPassword,
      };
    });
  
    return {
      data,
      count: totalCount,
      totalPages,
    };
  }
  

  async isScheduleAvailable(
    scheduleId: string,
    date: string,
    operatorsCount: number,
  ) {
    const appointmentDate = new Date(date);

    const existingAppointments = await this.appointmentRepository.find({
      where: {
        schedule: { id: scheduleId },
        appointmentDate: appointmentDate,
        status: AppointmentStatus.OPEN,
      },
    });

    if (existingAppointments.length >= operatorsCount) {
      throw new NotFoundException(
        `El horario para dicha fecha ya se encuentra reservado para el número máximo de operadores`,
      );
    }

    return true;
  }

  async findByWeek(date: Date, sectionId: string) {
    const maxUsersPerProcess: string = process.env.MAXUSERS;
    const platformUsers =
      await this.userPermissionsService.findPlatformOperators(sectionId);

    const totalMaxUsersPerProcess =
      parseInt(maxUsersPerProcess) * platformUsers.length;
    await this.sectionService.findOne(sectionId);

    const schedules = await this.scheduleService.findAll();

    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('appointment.scheduleId', 'scheduleId')
      .addSelect('COUNT(appointment.id)', 'appointmentsCount')
      .where('appointment.appointmentDate = :date', { date })
      .andWhere('appointment.sectionId = :sectionId', { sectionId })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.OPEN,
      })
      .groupBy('appointment.scheduleId')
      .getRawMany();

    const schedulesWithStatus = schedules.map((schedule) => {
      const appointmentsCount =
        result.find((r) => r.scheduleId === schedule.id)?.appointmentsCount ||
        0;

      const isAvailable = appointmentsCount < totalMaxUsersPerProcess;

      return {
        scheduleId: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        status: isAvailable ? EstadoDisponibilidad.DISPONIBLE : EstadoDisponibilidad.NO_DISPONIBLE,
        appointmentsCount,
      };
    });

    return schedulesWithStatus;
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      id: id,
    });

    if (!appointment)
      throw new NotFoundException(`Cita con id ${id} no encontrado`);
    return appointment;
  }

  remove(id: number) {
    return 'remove';
  }
  async removeByUser(userId: string, sectionId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        reservedBy: { id: userId },
        section: { id: sectionId },
        status: AppointmentStatus.OPEN,
      },
      relations: ['schedule'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrado en la sección');
    }

    appointment.status = AppointmentStatus.CLOSED;
    await this.appointmentRepository.save(appointment);
  }

  async removeBySection(userId: string, sectionId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        reservedBy: { id: userId },
        section: { id: sectionId },
      },
      relations: ['schedule'],
    });

    if (!appointment) {
      throw new NotFoundException('Ya borró la cita, Intenta actualizar');
    }
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [startHour, startMinute, startSecond] = appointment.schedule.startTime
      .split(':')
      .map(Number);

    appointmentDateTime.setHours(startHour, startMinute, startSecond);
    const now = new Date();
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / 3600000;

    if (hoursDiff <= 24) {
      throw new BadRequestException(
        'Ya no puede modificar la fecha de la cita ya que quedan menos de 24 horas',
      );
    }

    await this.appointmentRepository.remove(appointment);

    return {
      ok: true,
      msg: 'La cita ha sido eliminado correctamente',
    };
  }

  async hasOpenAppointmentBySection(sectionId: string, userId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        section: {
          id: sectionId,
        },
        status: AppointmentStatus.OPEN,
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
    const currentLimaTime = new Date(
      date.getTime() + limaOffset * 60 * 60 * 1000,
    );

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.appointmentDate < :currentTime', {
        currentTime: currentLimaTime,
      })
      .andWhere('appointment.status = :status', {
        status: 'OPEN',
      })
      .leftJoinAndSelect('appointment.reservedBy', 'user')
      .leftJoinAndSelect('appointment.section', 'section')
      .getMany();

    return appointments;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    delete updateAppointmentDto.isFirstTime;

    if (Object.keys(updateAppointmentDto).length === 0) {
      throw new BadRequestException('No update values provided');
    }

    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set(updateAppointmentDto)
      .where('id = :id', { id })
      .execute();

    return await this.appointmentRepository.findOneBy({ id });
  }
}
