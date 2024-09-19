import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule, ScheduleStatus } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly sectionService: SectionDocumentService,
  ) {}

  create(createScheduleDto: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
    });
    return this.scheduleRepository.save(schedule);
  }

  async findAll() {
    return await this.scheduleRepository.find();
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findOneBy({
      id: id,
    });

    if (!schedule)
      throw new NotFoundException(`schedule with id ${id} not found`);
    return schedule;
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
  ) {
    const schedule = await this.findOne(id);
    await this.sectionService.findOne(sectionId);

    if (!schedule.isAvailable) {
      throw new NotFoundException(`Horario no disponible`);
    }

    const { ok, msg } = await this.hasOpenScheduleBySection(sectionId,user.id);
    if(ok) {
      return {
        ok,
        message: msg
      }
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

  async hasOpenScheduleBySection(sectionId: string, userId: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        section: {
          id: sectionId,
        },
        isAvailable: false,
        status: ScheduleStatus.OPEN,
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
