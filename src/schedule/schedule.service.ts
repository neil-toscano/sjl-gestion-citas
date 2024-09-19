import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule, ScheduleStatus } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}
  create(createScheduleDto: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
    });
    return this.scheduleRepository.save(schedule);
  }

  findAll() {
    return this.scheduleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async update(
    id: string,
    sectionId: string,
    updateScheduleDto: UpdateScheduleDto,
    user: User,
  ) {
    await this.scheduleRepository.update(id, {
      ...updateScheduleDto,
      isAvailable: false,
      reservedBy: user,
      section: {
        id: sectionId,
      },
    });

    return this.scheduleRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  async reserveSchedule(
    id: string,
    sectionId: string,
    user: User,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule || !schedule.isAvailable) {
      throw new NotFoundException(`Horario no disponible`);
    }
    await this.scheduleRepository.update(id, {
      isAvailable: false,
      reservedBy: user,
      section: {
        id: sectionId,
      },
    });

    return this.scheduleRepository.findOneBy({ id });
  }

  async hasOpenScheduleSection(idSection: string, userId: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        section: {
          id: idSection,
        },
        isAvailable: false,
        status: ScheduleStatus.OPEN,
        reservedBy: {
          id: userId
        }
      },
    });

    return schedule === null
      ? {
          ok: false,
          msg: 'Aún no tiene reservaciones',
        }
      : {
          ok: true,
          msg: 'Ya tiene reserva',
          schedule,
        };
  }
}
