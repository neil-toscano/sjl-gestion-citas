import { Injectable } from '@nestjs/common';
import { CreateAppointmentHistoryDto } from './dto/create-appointment-history.dto';
import { UpdateAppointmentHistoryDto } from './dto/update-appointment-history.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentHistory } from './entities/appointment-history.entity';

@Injectable()
export class AppointmentHistoryService {
  constructor(
    @InjectRepository(AppointmentHistory)
    private readonly appointmentHistoryRepository: Repository<AppointmentHistory>,
  ) {}
  create(
    platformUser: User,
    createAppointmentHistoryDto: CreateAppointmentHistoryDto,
  ) {
    const { sectionId, userId } = createAppointmentHistoryDto;
    const appointmentHistory = this.appointmentHistoryRepository.create({
      platformUser: platformUser,
      section: {
        id: sectionId,
      },
      user: {
        id: userId,
      },
    });

    return this.appointmentHistoryRepository.save(appointmentHistory);
  }

  findAll() {
    return `This action returns all appointmentHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointmentHistory`;
  }

  update(id: number, updateAppointmentHistoryDto: UpdateAppointmentHistoryDto) {
    return `This action updates a #${id} appointmentHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointmentHistory`;
  }
}
