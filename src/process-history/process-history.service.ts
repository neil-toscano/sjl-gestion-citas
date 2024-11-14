import { Injectable } from '@nestjs/common';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { UpdateProcessHistoryDto } from './dto/update-process-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessHistory } from './entities/process-history.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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

  async findAll(
    filterProcessHistoryDto: FilterProcessHistoryDto,
  ) {
    console.log(filterProcessHistoryDto);
    const { pageSize = 25, page = 0, fromDate, toDate, sectionId } = filterProcessHistoryDto;
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
  

  findOne(id: number) {
    return `This action returns a #${id} processHistory`;
  }

  update(id: number, updateProcessHistoryDto: UpdateProcessHistoryDto) {
    return `This action updates a #${id} processHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} processHistory`;
  }
}
