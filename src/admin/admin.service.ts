import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentsService } from 'src/documents/documents.service';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly documentService: DocumentsService,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly appointmentService: AppointmentService,
    private readonly processStatusService: ProcessStatusService,
  ) {}

  async findDocumentBySection(
    sectionId: string,
    userId: string,
    adminUser: User,
  ) {
    await this.sectionService.findOne(sectionId);
    const user = await this.userService.findOne(userId);

    const documents = await this.documentService.findBySection(sectionId, user);
    const documentsWithUser = documents.map((doc) => ({
      ...doc,
      user: user,
    }));

    return documentsWithUser;
  }

  async finalizeAndRemoveAll(userId: string, sectionId: string) {
    const user = await this.userService.findOne(userId);

    await this.appointmentService.removeByUser(userId, sectionId);
    const processStatus = await this.processStatusService.findOneByUserSection(
      sectionId,
      user,
    );
    await this.processStatusService.remove(processStatus.id);

    const documents = await this.documentService.findBySection(sectionId, user);

    await this.documentService.removeDocuments(documents);
    return {
      ok: true,
      msg: 'Se inicializó todo el proceso',
    };
  }

  async removeDocuments(userId: string, sectionId: string) {
    const user = await this.userService.findOne(userId);

    const processStatus = await this.processStatusService.findOneByUserSection(
      sectionId,
      user,
    );

    await this.processStatusService.remove(processStatus.id);

    const documents = await this.documentService.findBySection(sectionId, user);

    await this.documentService.removeDocuments(documents);
    return {
      ok: true,
      msg: 'Se inicializó todo el proceso',
    };
  }

  async updateUserByAdmin(id: string, updateUserDto: UpdateUserByAdminDto) {
    return await this.userService.update(id, updateUserDto);
  }
}
