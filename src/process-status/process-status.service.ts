import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcessStatusDto } from './dto/create-process-status.dto';
import { UpdateProcessStatusDto } from './dto/update-process-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessStatus } from './entities/process-status.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProcessStatusEnum } from './interfaces/status.enum';
import { AssignmentsService } from 'src/assignments/assignments.service';

@Injectable()
export class ProcessStatusService {
  constructor(
    @InjectRepository(ProcessStatus)
    private readonly processStatusRepository: Repository<ProcessStatus>,
    private readonly assignmentService: AssignmentsService
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

  async findUsersWithCompletedDocuments(sectionId: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    const assignedUsers = await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map(a => a.user.id);
  
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.COMPLETE,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });
  }
  

  async findNextUserForReview(
    sectionId: string,
    adminId: string,
  ) {
    await this.assignmentService.remove(adminId);
    const assignedUsers = await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map(a => a.user.id);

    const userForReview = await this.processStatusRepository.findOne({
      where: {
        status: ProcessStatusEnum.COMPLETE,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });

    if (!userForReview) {
      return [];
    }

    await this.assignmentService.create(
      {
        sectionDocumentId: sectionId,
        userId: userForReview.user.id,
      },
      adminId,
    );
    return [userForReview];
  }
  
  async getAllUsersWithCorrectedDocuments(sectionId: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    const assignedUsers = await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map(a => a.user.id);
  
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.CORRECTED,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });
  }
  

  async NextUserCorrected(
    sectionId: string,
    adminId: string,
  ) {
    await this.assignmentService.remove(adminId);
    const assignedUsers = await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map(a => a.user.id);

    const userForReview = await this.processStatusRepository.findOne({
      where: {
        status: ProcessStatusEnum.CORRECTED,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });

    if (!userForReview) {
      return [];
    }

    await this.assignmentService.create(
      {
        sectionDocumentId: sectionId,
        userId: userForReview.user.id,
      },
      adminId,
    );
    return [userForReview];
  }

  async getAllUsersWithUnresolvedDocuments(sectionId: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    const assignedUsers = await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map(a => a.user.id);
  
    return await this.processStatusRepository.find({
      where: {
        status: ProcessStatusEnum.UNDER_OBSERVATION,
        section: { id: sectionId },
        user: { id: Not(In(assignedUserIds)) },
      },
      relations: ['user'],
    });
  }
  
  async findOneByUserSection(sectionId: string, user: User, throwErrorIfNotFound = true) {
    const processStatus = await this.processStatusRepository.findOne({
      where: {
        user: { id: user.id },
        section: { id: sectionId },
      },
    });
  
    if (!processStatus && throwErrorIfNotFound) {
      throw new NotFoundException(`El usuario no ha iniciado ningún proceso`);
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
