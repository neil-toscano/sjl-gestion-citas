import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';

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
}
