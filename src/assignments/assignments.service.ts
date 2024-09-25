import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AssignmentsService {
  constructor(@InjectRepository(Assignment)
  private readonly assignmentRepository: Repository<Assignment>,) {

  }
  async create(createAssignmentDto: CreateAssignmentDto) {
    const newAssignment = this.assignmentRepository.create({
      sectionDocument: {
        id: createAssignmentDto.sectionDocumentId
      },
      user: {
        id: createAssignmentDto.userId
      }
    });
    return await this.assignmentRepository.save(newAssignment);

  }

  
  findAll() {
    return `This action returns all assignments`;
  }
  
  async findOneByUserAndSection(userId: string, idSection: string) {
    console.log(userId, idSection);
    const assignment = await this.assignmentRepository.findOne({
      where: {
        sectionDocument: {
          id: idSection
        },
        user: {
          id: userId
        }
      }
    })
    return assignment? true: false;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }
}
