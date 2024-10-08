import { Injectable, NotFoundException } from '@nestjs/common';
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
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly documentService: DocumentsService,
    private readonly assignmentService: AssignmentsService,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly appointmentService: AppointmentService,
  ) {}
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async findAllCompleted(id:string, admin: User) {
    await this.assignmentService.remove(admin.id);
    return await this.documentService.readyForReviewBySection(id);
  }

  async findBySection(idSection: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    const user = await this.documentService.findFirstUserReadyForReviewBySection(idSection, admin.id);
    return user;
  }

  async getUsersWithCorrectedDocuments(idSection: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    const validUser =  await this.documentService.findFirstUserWithCorrectedDocuments(idSection, admin.id);
    return validUser
  }

  async getAllUsersWithCorrectedDocuments(idSection: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    return await this.documentService.getUsersWithCorrectedDocuments(idSection);
  }

  async getAllUsersWithUnresolvedDocuments(idSection: string, admin: User) {
    await this.assignmentService.remove(admin.id);
    return await this.documentService.getUsersWithObservedDocuments(idSection);
  }
  
  async findDocumentBySection(idSection: string, idUser: string, adminUser: User) {
    await this.sectionService.findOne(idSection);
    const user = await this.userService.findOne(idUser);

    const documents = await this.documentService.findSectionDocumentsByUser(
      idSection,
      idUser,
    );
    const documentsWithUser = documents.map(doc => ({
      ...doc,
      user: user,
    }));
    
    return documentsWithUser;
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
  
  async finalizeAndRemoveAll(userId: string, sectionId: string ) {
    
    await this.appointmentService.removeByUser(userId, sectionId);
    const documents = await this.documentService.findSectionDocumentsByUser(sectionId, userId);
    if (documents.length === 0) {
      throw new NotFoundException('No se encontraron documentos PDF para esta sección y usuario.');
    }

    await this.documentService.removeDocuments(documents);
    return {
      ok: true,
      msg: 'Se inicializó todo el proceso'
    }
  }
}
