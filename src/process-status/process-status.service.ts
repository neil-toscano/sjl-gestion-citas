import { Injectable } from '@nestjs/common';
import { CreateProcessStatusDto } from './dto/create-process-status.dto';
import { UpdateProcessStatusDto } from './dto/update-process-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessStatus } from './entities/process-status.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProcessStatusEnum } from './interfaces/status.enum';

@Injectable()
export class ProcessStatusService {
  constructor(
    @InjectRepository(ProcessStatus)
    private readonly processStatusRepository: Repository<ProcessStatus>,
  ) {

  }
  async create(createProcessStatusDto: CreateProcessStatusDto, user: User) {
    const processStatus = this.processStatusRepository.create({
      user: {
        id: user.id,
      },
      section: {
        id: createProcessStatusDto.sectionDocumentId
      },
      status: ProcessStatusEnum.INCOMPLETE,
    });
    await this.processStatusRepository.save(processStatus);
  }

  findAll() {
    return `This action returns all processStatus`;
  }

  findOneByUserSection(sectionId: string, user: User) {
    return this.processStatusRepository.findOne({
      where: {
        user: {
          id: user.id
        },
        section: {
          id: sectionId
        }
      }
    });
  }

  async update(id: string, updateProcessStatusDto: UpdateProcessStatusDto) {

    const { status } = updateProcessStatusDto;

    const processStatus = await this.processStatusRepository.findOne({ where: { id } });


    if (!processStatus) {
        throw new Error('Process status not found');
    }

    await this.processStatusRepository
    .createQueryBuilder()
    .update(ProcessStatus)
    .set({ status:  status })
    .where("id = :id", { id: id })
    .execute()

    return processStatus; 
  }

  remove(id: number) {
    return `This action removes a #${id} processStatus`;
  }
}
