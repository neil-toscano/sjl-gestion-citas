import { Injectable } from '@nestjs/common';
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
    const newAssignment = this.assignmentRepository.create(createAssignmentDto);
    await this.assignmentRepository.save(newAssignment);
    return newAssignment;
  }

  findAll() {
    return `This action returns all assignments`;
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
