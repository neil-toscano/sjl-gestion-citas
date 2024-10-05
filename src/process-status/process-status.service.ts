import { Injectable, NotFoundException } from '@nestjs/common';
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
      status: createProcessStatusDto.status,
    });
    await this.processStatusRepository.save(processStatus);
  }

  findAll() {
    return `This action returns all processStatus`;
  }

  async findOneByUserSection(sectionId: string, user: User) {
    const processStatus = await this.processStatusRepository.findOne({
      where: {
        user: {
          id: user.id
        },
        section: {
          id: sectionId
        }
      }
    });

    if(!processStatus) {
      if (!processStatus) {
        throw new NotFoundException(`Aún no tiene proceso iniciado`);
      }
    }
    return processStatus;
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

  async remove(id: string) {
    const processStatus = await this.processStatusRepository.findOneBy({ id });
    await this.processStatusRepository.remove(processStatus);
    return `Se eliminó correctamente`;
  }
}
