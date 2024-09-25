import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentsService } from 'src/documents/documents.service';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AssignmentsService } from 'src/assignments/assignments.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly documentService: DocumentsService,
    private readonly assignmentService: AssignmentsService,

  ) {

  }
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findBySection(idSection:string) {
    return await this.documentService.readyForReviewBySection(idSection)
  }
  async findDocumentBySection(idSection:string, idUser:string) {
    await this.assignmentService.create({
      sectionDocumentId: idSection,
      userId: idUser
    });
    return await this.documentService.findSectionDocumentsByUser(idSection, idUser);
  }
  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
