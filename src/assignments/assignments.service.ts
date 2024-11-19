import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto, adminId: string) {
    const newAssignment = this.assignmentRepository.create({
      sectionDocument: {
        id: createAssignmentDto.sectionDocumentId,
      },
      user: {
        id: createAssignmentDto.userId,
      },
      admin: {
        id: adminId,
      },
    });
    return await this.assignmentRepository.save(newAssignment);
  }

  findAllBySection(sectionId: string) {
    return this.assignmentRepository.find({
      where: {
        sectionDocument: {
          id: sectionId,
        },
      },
      relations: ['user'],
    });
  }

  async findOneByUserAndSection(userId: string, idSection: string) {
    const assignment = await this.assignmentRepository.findOne({
      where: {
        sectionDocument: {
          id: idSection,
        },
        user: {
          id: userId,
        },
      },
    });
    return assignment ? true : false;
  }

  async remove(id: string) {
    await this.assignmentRepository
      .createQueryBuilder()
      .delete()
      .from(Assignment)
      .where('admin = :adminId', { adminId: id }) // elimina filas donde el campo admin coincide con el adminId
      .execute();
    return `Esta acción removió a #${id} asignación`;
  }
}
