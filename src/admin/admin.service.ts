import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentsService } from 'src/documents/documents.service';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly documentService: DocumentsService,
    private readonly assignmentService: AssignmentsService,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
  ) {}
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findBySection(idSection: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    return await this.documentService.readyForReviewBySection(idSection);
  }
  async findDocumentBySection(idSection: string, idUser: string, adminUser: User) {
    await this.sectionService.findOne(idSection);
    await this.userService.findOne(idUser);

    await this.assignmentService.create({
      sectionDocumentId: idSection,
      userId: idUser,
    }, adminUser.id);
    return await this.documentService.findSectionDocumentsByUser(
      idSection,
      idUser,
    );
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
