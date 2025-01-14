import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { FilterAppointmentDto } from '../dto/filter-appointment.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { ProcessStatusService } from 'src/process-status/process-status.service';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private scheduleService: ScheduleService,
    private processSatusService: ProcessStatusService,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ) {
    const processStatus = await this.processSatusService.findOneByUserSection(
      sectionId,
      user,
      false,
    );
    if (processStatus?.isRescheduled) {
      createAppointmentDto.isRescheduled = true;
    }
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

  async findOneByFilter(filter: FindOptionsWhere<Appointment>) {
    const appointment = await this.appointmentRepository.findOne({
      where: filter,
      relations: ['schedule'],
    });

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const { scheduleId } = updateAppointmentDto;
    delete updateAppointmentDto.scheduleId;

    const updateData: any = {
      ...updateAppointmentDto,
    };

    if (scheduleId) {
      await this.scheduleService.findOne(scheduleId);
      updateData.schedule = {
        id: scheduleId,
      };
    }

    return await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set(updateData)
      .where('id = :id', { id: id })
      .execute();
  }

  async findByFilter(filterAppointmentDto: FilterAppointmentDto) {
    const {
      pageSize = 25,
      page = 0,
      fromDate,
      toDate,
      sectionId,
      status,
    } = filterAppointmentDto;

    const offset = pageSize * page;

    const queryBuilder =
      this.appointmentRepository.createQueryBuilder('appointment');

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
      queryBuilder.andWhere('appointment.appointmentDate >= :fromDate', {
        fromDate,
      });
    }

    if (toDate) {
      queryBuilder.andWhere('appointment.appointmentDate <= :toDate', {
        toDate,
      });
    }

    queryBuilder.take(pageSize).skip(offset);

    queryBuilder.orderBy('appointment.appointmentDate', 'ASC');

    return await queryBuilder.getManyAndCount();
  }

  async getAppointmentCountBySchedule(date: Date, sectionId: string) {
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

    return result;
  }

  async findAll(user: User, sectionId: string) {
    const appointments = await this.appointmentRepository.find({
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
    return appointments;
  }

  async getExpiredAppointments(currentLimaTime: Date) {
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

  async findOneById(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
      relations: ['reservedBy', 'section'],
    });
    return appointment;
  }
}
