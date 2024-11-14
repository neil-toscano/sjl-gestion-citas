import { Injectable } from '@nestjs/common';
import { CreateAppointmentHistoryDto } from './dto/create-appointment-history.dto';
import { UpdateAppointmentHistoryDto } from './dto/update-appointment-history.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentHistory } from './entities/appointment-history.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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

  async findAll(
    paginationDto: PaginationDto,
    filterProcessHistoryDto: FilterAppointmentHistoryDto,
  ) {
    const { pageSize = 25, page = 0 } = paginationDto;
    const offset = pageSize * page;
  
    const { fromDate, toDate, sectionId } = filterProcessHistoryDto;
  
    const queryBuilder =
      this.appointmentHistoryRepository.createQueryBuilder('appointmentHistory');
  
    queryBuilder
      .leftJoinAndSelect('appointmentHistory.user', 'user')
      .leftJoinAndSelect('appointmentHistory.platformUser', 'platformUser')
      .leftJoinAndSelect('appointmentHistory.section', 'section');
  
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
  
    const [appointmentHistory, totalCount] = await queryBuilder.getManyAndCount();
  
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
