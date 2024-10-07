import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
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

  findAll() {
    return "hello"
  }
  findAllBySection(sectionId: string) {
    return this.assignmentRepository.find({
      where: {
        sectionDocument: {
          id: sectionId
        }
      },
      relations: ['user'],
    })
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

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  async remove(id: string) {
    await this.assignmentRepository
      .createQueryBuilder()
      .delete()
      .from(Assignment)
      .where('admin = :adminId', { adminId: id }) // elimina filas donde el campo admin coincide con el adminId
      .execute();
    return `This action removes a #${id} assignment`;
  }
}
