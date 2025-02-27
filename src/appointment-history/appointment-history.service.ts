import { Injectable } from '@nestjs/common';
import { CreateAppointmentHistoryDto } from './dto/create-appointment-history.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentHistory } from './entities/appointment-history.entity';
import { FilterAppointmentHistoryDto } from './dto/filter-appointment-history.dto';

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
    const { sectionId, userId, appointmentId } = createAppointmentHistoryDto;
    const appointmentHistory = this.appointmentHistoryRepository.create({
      platformUser: platformUser,
      section: {
        id: sectionId,
      },
      user: {
        id: userId,
      },
      appointment: {
        id: appointmentId,
      },
    });

    return this.appointmentHistoryRepository.save(appointmentHistory);
  }

  async findAll(filterProcessHistoryDto: FilterAppointmentHistoryDto) {
    const {
      pageSize = 25,
      page = 0,
      fromDate,
      toDate,
      sectionId,
    } = filterProcessHistoryDto;
    const offset = pageSize * page;

    const queryBuilder =
      this.appointmentHistoryRepository.createQueryBuilder(
        'appointmentHistory',
      );

    queryBuilder
      .leftJoinAndSelect('appointmentHistory.user', 'user')
      .leftJoinAndSelect('appointmentHistory.platformUser', 'platformUser')
      .leftJoinAndSelect('appointmentHistory.section', 'section')
      .leftJoinAndSelect('appointmentHistory.appointment', 'appointment');

    if (fromDate) {
      queryBuilder.andWhere('appointmentHistory.createdAt >= :fromDate', {
        fromDate,
      });
    }
    if (toDate) {
      queryBuilder.andWhere('appointmentHistory.createdAt <= :toDate', {
        toDate,
      });
    }

    if (sectionId) {
      queryBuilder.andWhere('appointmentHistory.section.id = :sectionId', {
        sectionId,
      });
    }

    queryBuilder.take(pageSize).skip(offset);

    const [appointmentHistory, totalCount] =
      await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = appointmentHistory.map(({ user, platformUser, ...rest }) => {
      const { password, ...userWithoutPassword } = user || {};
      const { password: platformPassword, ...platformUserWithoutPassword } =
        platformUser || {};

      return {
        ...rest,
        user: userWithoutPassword,
        platformUser: platformUserWithoutPassword,
      };
    });

    return {
      data,
      count: totalCount,
      totalPages,
    };
  }
}
