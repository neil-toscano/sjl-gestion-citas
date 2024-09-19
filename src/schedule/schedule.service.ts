import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
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

  async update(id: string, sectionId:string, updateScheduleDto: UpdateScheduleDto, user: User) {

    await this.scheduleRepository.update( id, {
      ...updateScheduleDto,
      isAvailable: false,
      reservedBy: user,
      section: {
        id: sectionId
      },
    });

    return this.scheduleRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  async reserveSchedule(id: string, userId: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneBy({id});
    if (!schedule || !schedule.isAvailable) {
      throw new Error('Schedule not available or not found');
    }
    schedule.isAvailable = false;
    schedule.reservedBy = { id: userId } as any; // Type assertion for simplicity
    return this.scheduleRepository.save(schedule);
  }
}
