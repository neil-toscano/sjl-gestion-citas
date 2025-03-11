import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Not, Repository } from 'typeorm';
import { ProcessStatus } from '../entities/process-status.entity';
import { CreateProcessStatusDto } from '../dto/create-process-status.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateProcessStatusDto } from '../dto/update-process-status.dto';
import { ProcessStatusEnum } from '../interfaces/status.enum';

@Injectable()
export class ProcessStatusRepository {
  constructor(
    @InjectRepository(ProcessStatus)
    private processStatusRepository: Repository<ProcessStatus>,
  ) {}

  async create(createProcessStatusDto: CreateProcessStatusDto, user: User) {
    const processStatus = this.processStatusRepository.create({
      user: {
        id: user.id,
      },
      section: {
        id: createProcessStatusDto.sectionDocumentId,
      },
      status: createProcessStatusDto.status,
    });
    return await this.processStatusRepository.save(processStatus);
  }

  async remove(id: string) {
    const processStatus = await this.processStatusRepository.findOneBy({ id });
    processStatus.isCompleted = true;
    return this.processStatusRepository.save(processStatus);
  }

  async findOneById(id: string) {
    return await this.processStatusRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateProcessStatusDto: UpdateProcessStatusDto) {
    const { status } = updateProcessStatusDto;

    const currentProcessStatus = await this.processStatusRepository.findOneBy({
      id,
    });
    const verifiedAtUpdate =
      status === ProcessStatusEnum.VERIFIED && !currentProcessStatus.verifiedAt
        ? { verifiedAt: new Date() }
        : {};

    return await this.processStatusRepository
      .createQueryBuilder()
      .update(ProcessStatus)
      .set({
        ...updateProcessStatusDto,
        ...verifiedAtUpdate,
      })
      .where('id = :id', { id: id })
      .execute();
  }

  async getCompletedProcessStatus(
    sectionId: string,
    assignedUserIds: string[],
  ) {
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.EN_PROCESO,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
      order: {
        createdAt: 'ASC',
      }
    });
  }

  async getAllCompletedProcessStatus() {
    return await this.processStatusRepository.find({
      where: [
        { 
          status: ProcessStatusEnum.EN_PROCESO,
          isAssigned: false,
          isCompleted: false,
        },
        { 
          status: ProcessStatusEnum.UNDER_OBSERVATION,
          isAssigned: false,
          isCompleted: false,
        },
        { 
          status: ProcessStatusEnum.CORRECTED,
          isAssigned: false,
          isCompleted: false,
        }
      ],
      relations: ['user', 'section'],
      select: {
        id: true,
        status: true,
        createdAt: true,
        isAssigned: true,
      user: {
        id: true,
        documentNumber: true,
      },
      section: {
        id: true,
        sectionName: true,
      },
      },
      order: {
        createdAt: 'ASC',
      }
    });
  }

  async findOneForReview(sectionId: string, assignedUserIds: string[]) {
    return await this.processStatusRepository.findOne({
      where: {
        status: ProcessStatusEnum.EN_PROCESO,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
      order: {
        createdAt: 'ASC'
      }
    });
  }

  async getAllUsersWithCorrectedDocuments(
    sectionId: string,
    assignedUserIds: string[],
  ) {
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.CORRECTED,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });
  }

  async NextUserCorrected(sectionId: string, assignedUserIds: string[]) {
    const userForReview = await this.processStatusRepository.findOne({
      where: {
        status: ProcessStatusEnum.CORRECTED,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });

    return userForReview;
  }

  async getAllUsersWithUnresolvedDocuments(
    sectionId: string,
    assignedUserIds: string[],
  ) {
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.UNDER_OBSERVATION,
        isCompleted: false,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });
  }

  async getAllUsersWithObservedDocuments() {
    const dateLimit = new Date();
    dateLimit.setHours(dateLimit.getHours() - 48);

    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.UNDER_OBSERVATION,
        updatedAt: LessThan(dateLimit),
        isCompleted: false,
      },
      relations: ['user', 'section'],
    });
  }

  async checkEligibilityForAppointment(sectionId: string, user: User) {
    const processStatus = await this.processStatusRepository.findOne({
      where: {
        section: { id: sectionId },
        user: { id: user.id },
        isCompleted: false,
      },
      relations: ['user'],
    });

    return processStatus;
  }

  async findOneByUserSection(
    sectionId: string,
    user: User,
    throwErrorIfNotFound = true,
  ) {
    const processStatus = await this.processStatusRepository.findOne({
      where: {
        user: { id: user.id },
        section: { id: sectionId },
        isCompleted: false,
      },
    });

    if (!processStatus && throwErrorIfNotFound) {
      throw new NotFoundException(`El usuario no ha iniciado ningún proceso`);
    }

    return processStatus;
  }

  async checkStatus(
    sectionId: string,
    userId: string,
    throwErrorIfNotFound = true,
  ) {
    const processStatus = await this.processStatusRepository.findOne({
      where: {
        user: { id: userId },
        section: { id: sectionId },
        isCompleted: false,
      },
    });

    if (!processStatus && throwErrorIfNotFound) {
      throw new NotFoundException(`El usuario no ha iniciado ningún proceso`);
    }

    return processStatus;
  }

  async countByStatus() {
    //TODO: CAMBIOS
    const result = await this.processStatusRepository
      .createQueryBuilder('processStatus')
      .where('processStatus.isCompleted = :isCompleted', { isCompleted: false })
      .select('processStatus.sectionId', 'sectionId') // Agrupamos por sectionId
      .addSelect('processStatus.status', 'status')
      .addSelect('COUNT(processStatus.id)', 'count')
      .groupBy('processStatus.sectionId') // Agrupamos por sectionId
      .addGroupBy('processStatus.status') // Agrupamos por status también
      .getRawMany();

    return result;
  }
}
