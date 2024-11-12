import { Injectable } from '@nestjs/common';
import { CreateProcessHistoryDto } from './dto/create-process-history.dto';
import { UpdateProcessHistoryDto } from './dto/update-process-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessHistory } from './entities/process-history.entity';
import { User } from 'src/user/entities/user.entity';

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

  findAll() {
    return `This action returns all processHistory`;
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
