import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { SectionTypeDocumentService } from 'src/section-type-document/section-type-document.service';
import { User } from 'src/user/entities/user.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { UserService } from 'src/user/user.service';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { groupDocumentsBySection } from './utils/organize-documents';
import { AppointmentService } from 'src/appointment/appointment.service';
import { SectionType } from 'src/section-type-document/interfaces/document';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly fileService: FilesService,
    private readonly sectionTypeService: SectionTypeDocumentService,
    private readonly sectionService: SectionDocumentService,
    private readonly userService: UserService,
    private readonly assignmentService: AssignmentsService,
    private readonly AppointmentService: AppointmentService,
    private readonly emailService: EmailService,
  ) {}

  async create(user: User, createDocumentDto: CreateDocumentDto) {
    const { id } = user;
    const { sectionTypeId } = createDocumentDto;

    await this.sectionTypeService.findOne(sectionTypeId);

    const { isDocumentExists } = await this.findOneBySectionTypeId(
      sectionTypeId,
      id,
    );
    if (isDocumentExists) {
      await this.documentRepository.delete({
        sectionTypeDocument: { id: sectionTypeId },
        user: { id: id },
      });
    }

    const newDocument = this.documentRepository.create({
      sectionTypeDocument: { id: createDocumentDto.sectionTypeId },
      user: user,
      fileUrl: createDocumentDto.fileUrl,
    });

    return await this.documentRepository.save(newDocument);
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOneBy({
      id: id,
    });
    if (!document)
      throw new NotFoundException(`Document with id ${id} not found`);
    return document;
  }

  async findCountsBySection() {
    const sectionTypeDocuments = await this.sectionTypeService.findAll();

    const result = await Promise.all(
        sectionTypeDocuments.map(async (section: any) => {
            const users = await this.readyForReviewBySection(section.sectionId);

            return {
                section,
                count: {
                    newDocuments: users.length,
                },
            };
        })
    );

    return result;
}

  async findAllSectionsByUser(id: string) {
    const documents = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.sectionTypeDocument', 'sectionTypeDocument')
      .leftJoinAndSelect('sectionTypeDocument.section', 'sectionDocument') // JOIN a la tabla section
      .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument') // JOIN a la tabla typeDocument
      .where('document.user.id = :userId')
      .setParameters({ userId: id })
      .distinct(true)
      .getMany();

    const result = groupDocumentsBySection(documents);
    return result;
  }

  async findSectionDocumentsByUser(idSection: string, idUser: string) {
    await this.sectionService.findOne(idSection);
    await this.userService.findOne(idUser);
    const documents = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.sectionTypeDocument', 'sectionTypeDocument')
      .leftJoinAndSelect('sectionTypeDocument.section', 'sectionDocument')
      .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument')
      .where('document.user.id = :userId', { userId: idUser })
      .andWhere('sectionDocument.id = :sectionId', { sectionId: idSection }) // Filtrar por sección
      .distinct(true)
      .getMany();

    return documents;
  }

  async findOneBySectionTypeId(id: string, userId: string) {
    const result = await this.documentRepository.findOne({
      where: { sectionTypeDocument: { id: id }, user: { id: userId } },
    });

    if (!result) {
      return { isDocumentExists: false };
    }
    return { isDocumentExists: true };
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, user: User) {
    const document = await this.findOne(id);

    if (Object.keys(updateDocumentDto).length === 0) {
      return { message: 'No data provided for update' };
    }
    const promises = [];

  if (updateDocumentDto.fileUrl) {
    promises.push(this.fileService.deleteFile(document.fileUrl));
  }

  if (updateDocumentDto.status === 'OBSERVADO') {
    promises.push(
      this.emailService.createTemporaryEmail(user.email).catch(error => {
        // Manejar el error, por ejemplo, loguearlo
        console.error(`Error sending email to ${user.email}:`, error);
        return null; // O puedes lanzar el error si prefieres
      })
    );
  }

  await Promise.all(promises);

    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOneBy({ id });
  }

  async hasValidDocuments(sectionId: string, user: User) {
    const sectionDocuments = await this.verifySectionDocumentsUploaded(user, sectionId);

    const section = await this.sectionService.findOne(sectionId);
    if (sectionDocuments.length !== section.requiredDocumentsCount) {
      throw new UnprocessableEntityException('No tiene subido todos los documentos en la sección');
    }

    const allVerified = sectionDocuments.every(
      (document) => document.status === 'VERIFICADO',
    );
    if (!allVerified) {
      return {
        ok: false,
        msg: 'Sus documentos aún no se encuentrarn verificados',
      };
    }

    return {
      ok: true,
      msg: 'Se encuentra apto para hacer reserva de cita',
    };
  }

  async verifySectionDocumentsUploaded(user: User, sectionId: string) {

    const sectionDocuments = await this.documentRepository
    .createQueryBuilder('document')
    .leftJoinAndSelect('document.sectionTypeDocument', 'sectionTypeDocument')
    .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument') // Realiza el JOIN con typeDocument
    .leftJoin('document.user', 'user') // Realiza el JOIN con la entidad User
    .where('user.id = :userId', { userId: user.id }) // Filtra por el ID del usuario
    .andWhere('sectionTypeDocument.section.id = :sectionId', {
      sectionId: sectionId,
    }) // Filtra por el ID de la sección
    .orderBy('typeDocument.name', 'ASC')
    .getMany(); // O getOne() si esperas un solo resultado

    
    return sectionDocuments;
  }
 
  async findDocumentBySection(id: string, user: User) {
    // const section = await this.sectionService.findOne(id);
    
    const documents = await this.verifySectionDocumentsUploaded(user, id);
    // if(section.requiredDocumentsCount === documents.length) {
      
    //   throw new UnprocessableEntityException('No tiene subido todos los documentos en la sección');
      
    // }
    return documents;
  }

  async findCompleteDocumentBySection(id: string, user: User) {
    const section = await this.sectionService.findOne(id);
    
    const documents = await this.verifySectionDocumentsUploaded(user, id);
    if(section.requiredDocumentsCount !== documents.length) {
      return {
        statusCode: 422,
        message: "No tiene cargado todos los documentos en la sección",
        documents
      }
      
    }
    return {
      statusCode: 400,
      message: "Tiene cargado todos sus documentos",
      documents
    }
  }

  async readyForReviewBySection(idSection: string) {
    await this.sectionService.findOne(idSection);

    const users = await this.userService.findAll();

    const section = await this.sectionService.findOne(idSection);
    const validUsers = [];
    for (const user of users) {
      const assignmentExists =
        await this.assignmentService.findOneByUserAndSection(
          user.id,
          idSection,
        );

      if (assignmentExists) {
        continue;
      }

      const sectionDocuments = await this.findDocumentBySection(
        idSection,
        user,
      );

      if (sectionDocuments.length !== section.requiredDocumentsCount) {
        continue;
      }

      const allVerified = sectionDocuments.every(
        (document) => document.status === 'EN PROCESO',
      );

      if (allVerified) {
        validUsers.push(user);
      }
    }

    return validUsers;
  }

  async findFirstUserReadyForReviewBySection(idSection: string, adminId: string) {
    await this.sectionService.findOne(idSection);
  
    const users = await this.userService.findAll();
    const section = await this.sectionService.findOne(idSection);
  
    for (const user of users) {
      const assignmentExists = await this.assignmentService.findOneByUserAndSection(
        user.id,
        idSection,
      );
  
      if (assignmentExists) {
        continue;
      }
  
      const sectionDocuments = await this.findDocumentBySection(idSection, user);
  
      if (sectionDocuments.length !== section.requiredDocumentsCount) {
        continue;
      }
  
      const allVerified = sectionDocuments.every(
        (document) => document.status === 'EN PROCESO',
      );
  
      if (allVerified) {
        await this.assignmentService.create({
          sectionDocumentId: idSection,
          userId: user.id,
        }, adminId);

        return [user]; // Devuelve el primer usuario que cumpla los requisitos
      }
    }
  
    return [];
  }
  
  async getUsersWithCorrectedDocuments(idSection: string) {
    await this.sectionService.findOne(idSection);

    const users = await this.userService.findAll();

    const section = await this.sectionService.findOne(idSection);

    const validUsers = [];
    for (const user of users) {
      const assignmentExists =
        await this.assignmentService.findOneByUserAndSection(
          user.id,
          idSection,
        );

      if (assignmentExists) {
        continue;
      }
      const sectionDocuments = await this.findDocumentBySection(
        idSection,
        user,
      );

      if (sectionDocuments.length !== section.requiredDocumentsCount) {
        continue;
      }

      const hasVerifiedDocument = sectionDocuments.some(
        (document) => document.status === 'VERIFICADO'
      );
      
      const hasInProcessDocument = sectionDocuments.some(
        (document) => document.status === 'EN PROCESO'
      );
      
      const noObservedDocuments = sectionDocuments.every(
        (document) => document.status !== 'OBSERVADO'
      );
      
      if (hasVerifiedDocument && hasInProcessDocument && noObservedDocuments) {
        validUsers.push(user);
      }
    }

    return validUsers;
  }
  async findFirstUserWithCorrectedDocuments(idSection: string, adminId: string) {
    await this.sectionService.findOne(idSection);
  
    const users = await this.userService.findAll();
    const section = await this.sectionService.findOne(idSection);
  
    for (const user of users) {
      const assignmentExists = await this.assignmentService.findOneByUserAndSection(
        user.id,
        idSection,
      );
  
      if (assignmentExists) {
        continue;
      }
  
      const sectionDocuments = await this.findDocumentBySection(idSection, user);
  
      if (sectionDocuments.length !== section.requiredDocumentsCount) {
        continue;
      }
  
      const hasVerifiedDocument = sectionDocuments.some(
        (document) => document.status === 'VERIFICADO',
      );
  
      const hasInProcessDocument = sectionDocuments.some(
        (document) => document.status === 'EN PROCESO',
      );
  
      const noObservedDocuments = sectionDocuments.every(
        (document) => document.status !== 'OBSERVADO',
      );
  
      if (hasVerifiedDocument && hasInProcessDocument && noObservedDocuments) {
        await this.assignmentService.create({
          sectionDocumentId: idSection,
          userId: user.id,
        }, adminId);
        return [user]; 
      }
    }
  
    return []; // Si ningún usuario es válido, devolver null o un valor vacío
  }
  

  async getUsersWithObservedDocuments(idSection: string) {
    await this.sectionService.findOne(idSection);
  
    const users = await this.userService.findAll();
  
    const section = await this.sectionService.findOne(idSection);
  
    const validUsers = [];
  
    for (const user of users) {
      const assignmentExists = await this.assignmentService.findOneByUserAndSection(
        user.id,
        idSection,
      );
  
      if (assignmentExists) {
        continue;
      }
  
      const sectionDocuments = await this.findDocumentBySection(
        idSection,
        user,
      );
  
      if (sectionDocuments.length !== section.requiredDocumentsCount) {
        continue;
      }
  
      const hasObservedDocument = sectionDocuments.some(
        (document) => document.status === 'OBSERVADO'
      );
  
      if (hasObservedDocument) {
        validUsers.push(user);
      }
    }
  
    return validUsers;
  }

  async getUsersWithoutAppointmentsButVerified() {
    // Obtener todas las secciones y usuarios en paralelo
    const [sections, users] = await Promise.all([
      this.sectionService.findAll(),
      this.userService.findAll(),
    ]);
  
    const validUsers = [];
  
    // Procesar usuarios en paralelo usando Promise.all
    await Promise.all(users.map(async (user) => {
      // Para cada usuario, procesar cada sección
      await Promise.all(sections.map(async (section) => {
        // Verificar si el usuario ya tiene una asignación de cita para la sección
        const { ok } = await this.AppointmentService.hasOpenAppointmentBySection(section.id, user.id);
  
        if (ok) return; // Si tiene cita, continuar con la siguiente sección
  
        // Obtener los documentos del usuario para la sección actual
        const sectionDocuments = await this.findDocumentBySection(section.id, user);
  
        // Verificar si el usuario tiene el número correcto de documentos requeridos
        if (sectionDocuments.length !== section.requiredDocumentsCount) return;
  
        // Verificar si todos los documentos están en estado 'VERIFICADO'
        const allDocumentsVerified = sectionDocuments.every(
          (document) => document.status === 'VERIFICADO'
        );
  
        if (allDocumentsVerified) {
          validUsers.push({ user, section });
        }
      }));
    }));
  
    // Devolver los usuarios que cumplen con los requisitos en diferentes secciones
    return validUsers;
  }
  
  
  
  
  
  async removeDocuments(documents: Document[]) {
    return await this.documentRepository.remove(documents);
  }
}
