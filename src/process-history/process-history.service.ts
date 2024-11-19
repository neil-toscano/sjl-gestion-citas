import { Injectable } from '@nestjs/common';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessHistory } from './entities/process-history.entity';
import { User } from 'src/user/entities/user.entity';
import { FilterProcessHistoryDto } from './dto/filter-process-history.dto';

@Injectable()
export class ProcessHistoryService {
  constructor(
    @InjectRepository(ProcessHistory)
    private readonly processHistoryRepository: Repository<ProcessHistory>,
  ) {}

  create(platformUser: User, createProcessHistoryDto: CreateProcessHistoryDto) {
    const { sectionId, state, userId } = createProcessHistoryDto;
    const processHistory = this.processHistoryRepository.create({
      platformUser: {
        id: platformUser.id,
      },
      section: {
        id: sectionId,
      },
      state,
      user: {
        id: userId,
      },
    });
    return this.processHistoryRepository.save(processHistory);
  }

  async findAll(filterProcessHistoryDto: FilterProcessHistoryDto) {
    const {
      pageSize = 25,
      page = 0,
      fromDate,
      toDate,
      sectionId,
    } = filterProcessHistoryDto;
    const offset = pageSize * page;

    const queryBuilder =
      this.processHistoryRepository.createQueryBuilder('processHistory');

    queryBuilder
      .leftJoinAndSelect('processHistory.user', 'user')
      .leftJoinAndSelect('processHistory.platformUser', 'platformUser')
      .leftJoinAndSelect('processHistory.section', 'section');

    if (fromDate) {
      queryBuilder.andWhere('processHistory.createdAt >= :fromDate', {
        fromDate,
      });
    }
    if (toDate) {
      queryBuilder.andWhere('processHistory.createdAt <= :toDate', { toDate });
    }

    if (sectionId) {
      queryBuilder.andWhere('section.id = :sectionId', { sectionId });
    }

    queryBuilder.take(pageSize).skip(offset);

    const [processHistory, totalCount] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = processHistory.map(({ user, platformUser, ...rest }) => {
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

  async findAllForChart(filterProcessHistoryDto: FilterProcessHistoryDto) {
    const { fromDate, toDate, sectionId } = filterProcessHistoryDto;

    const startDate = fromDate
      ? new Date(fromDate)
      : new Date(new Date().getFullYear(), 0, 1);

    const endDate = toDate
      ? new Date(toDate).setHours(23, 59, 0, 0)
      : new Date().setHours(23, 59, 0, 0);

    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    const queryBuilder =
      this.processHistoryRepository.createQueryBuilder('processHistory');

    if (formattedStartDate) {
      queryBuilder.andWhere('processHistory.createdAt >= :startDate', {
        startDate: formattedStartDate,
      });
    }
    if (formattedEndDate) {
      queryBuilder.andWhere('processHistory.createdAt <= :endDate', {
        endDate: formattedEndDate,
      });
    }

    if (sectionId) {
      queryBuilder.andWhere('processHistory.section.id = :sectionId', {
        sectionId,
      });
    }

    queryBuilder
      .select([
        "DATE_TRUNC('month', processHistory.createdAt) AS month",
        'COUNT(processHistory.id) AS processcount',
      ])
      .groupBy('month')
      .orderBy('month', 'ASC');

    const result = await queryBuilder.getRawMany();
    const labels: string[] = [];
    const data: number[] = [];

    result.forEach(({ month, processcount }) => {
      const date = new Date(month);
      const monthName = date.toLocaleString('default', { month: 'long' });
      labels.push(monthName);
      data.push(processcount ? Number(processcount) : 0);
    });

    return {
      labels, // Meses (x-axis)
      data, // Cantidades de procesos (y-axis)
    };
  }
}
