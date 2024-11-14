import { Injectable } from '@nestjs/common';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { UpdateProcessHistoryDto } from './dto/update-process-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessHistory } from './entities/process-history.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  async findAll(paginationDto: PaginationDto) {
    const { pageSize = 25, page = 0 } = paginationDto;
    const offset = pageSize*page;
    const proccessHistory = await this.processHistoryRepository.find({
      take: pageSize,
      skip: offset,
    });
  
    return proccessHistory.map(({ user, platformUser, ...rest }) => {
      const { password, ...userWithoutPassword } = user || {};
      const { password: platformPassword, ...platformUserWithoutPassword } = platformUser || {};
  
      return {
        ...rest,
        user: userWithoutPassword,
        platformUser: platformUserWithoutPassword,
      };
    });
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
