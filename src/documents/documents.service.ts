import {
  ConflictException,
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
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { ProcessStatusEnum } from 'src/process-status/interfaces/status.enum';
import { TypeDocumentService } from 'src/type-document/type-document.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly fileService: FilesService,
    private readonly sectionTypeService: SectionTypeDocumentService,
    private readonly sectionService: SectionDocumentService,
    private readonly typeDocumentService: TypeDocumentService,
    private readonly userService: UserService,
    private readonly assignmentService: AssignmentsService,
    private readonly AppointmentService: AppointmentService,
    private readonly emailService: EmailService,
    private readonly processStatusService: ProcessStatusService,
  ) {}

  async create(user: User, createDocumentDto: CreateDocumentDto) {
    const { id } = user;
    const { sectionId, typeDocumentId } = createDocumentDto;

    await this.sectionService.findOne(sectionId);
    await this.typeDocumentService.findOne(typeDocumentId);

    const document = await this.documentRepository.findOne({
      where: {
        section: {
          id: sectionId,
        },
        typeDocument: {
          id: typeDocumentId,
        },
        user: {
          id: id,
        },
      },
    });

    if (document) {
      throw new ConflictException(
        'El tipo de documento para la sección ya existe.',
      );
    }

    const newDocument = this.documentRepository.create({
      section: { id: sectionId },
      typeDocument: { id: typeDocumentId },
      user: user,
      fileUrl: createDocumentDto.fileUrl,
    });

    const documentResult = await this.documentRepository.save(newDocument);

    const section = await this.sectionService.findOne(sectionId);

    const documents = await this.documentRepository.find({
      where: {
        section: {
          id: sectionId,
        },
        user: {
          id: user.id,
        },
      },
    });

    let processStatus = await this.processStatusService.findOneByUserSection(
      sectionId,
      user,
      false,
    );
    const newStatus =
      section.requiredDocumentsCount === documents.length
        ? ProcessStatusEnum.COMPLETE
        : ProcessStatusEnum.INCOMPLETE;

    if (processStatus) {
      await this.processStatusService.update(processStatus.id, {
        status: newStatus,
      });
    } else {
      await this.processStatusService.create(
        {
          sectionDocumentId: sectionId,
          status: newStatus,
        },
        user,
      );
    }

    return documentResult;
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOneBy({
      id: id,
    });
    if (!document)
      throw new NotFoundException(`Document with id ${id} not found`);
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.documentRepository.findOne({
      where: {
        id: id
      },
      relations: ['user']
    });
    
    const user = document.user;

    if (Object.keys(updateDocumentDto).length === 0) {
      return { message: 'No data provided for update' };
    }
    const promises = [];

    if (updateDocumentDto.fileUrl) {
      promises.push(this.fileService.deleteFile(document.fileUrl));
    }

    await Promise.all(promises);

    await this.documentRepository.update(id, updateDocumentDto);

    const documents = await this.documentRepository.find({
      where: {
        section: {
          id: updateDocumentDto.sectionId,
        },
        user: {
          id: user.id,
        },
      },
    });

    const section = await this.sectionService.findOne(
      updateDocumentDto.sectionId,
    );

    const processStatus = await this.processStatusService.findOneByUserSection(
      updateDocumentDto.sectionId,
      user,
    );

    if (updateDocumentDto.status) {
      switch (updateDocumentDto.status) {
        case 'EN PROCESO':
          if (section.requiredDocumentsCount === documents.length) {
            const hasVerifiedDocument = documents.some(
              (document) => document.status === 'VERIFICADO',
            );

            const hasInProcessDocument = documents.some(
              (document) => document.status === 'EN PROCESO',
            );

            const noObservedDocuments = documents.every(
              (document) => document.status !== 'OBSERVADO',
            );

            if (
              hasVerifiedDocument &&
              hasInProcessDocument &&
              noObservedDocuments
            ) {
              await this.processStatusService.update(processStatus.id, {
                status: ProcessStatusEnum.CORRECTED,
              });
            } else if (!noObservedDocuments) {
              await this.processStatusService.update(processStatus.id, {
                status: ProcessStatusEnum.UNDER_OBSERVATION,
              });
            } else if (!hasVerifiedDocument && noObservedDocuments) {
              await this.processStatusService.update(processStatus.id, {
                status: ProcessStatusEnum.COMPLETE,
              });
            }
          } else {
            await this.processStatusService.update(processStatus.id, {
              status: ProcessStatusEnum.INCOMPLETE,
            });
          }
          break;
        case 'VERIFICADO':
          const allVerified = documents.every(
            (document) => document.status === 'VERIFICADO',
          );
          if (allVerified) {
            await this.processStatusService.update(processStatus.id, {
              status: ProcessStatusEnum.VERIFIED,
            });
          }
          break;
        case 'OBSERVADO':
          await this.processStatusService.update(processStatus.id, {
            status: ProcessStatusEnum.UNDER_OBSERVATION,
          });
          break;
        default:
          throw new Error('Invalid status');
      }

      return this.documentRepository.findOneBy({ id });
    }
  }

  async findBySection(sectionId: string, user: User) {
    const section = await this.sectionService.findOne(sectionId);
    const documents = await this.documentRepository.find({
      where: {
        section: {
          id: sectionId,
        },
        user: {
          id: user.id,
        },
      },
      relations: ['typeDocument'],
    });
    return documents;
  }

  async removeDocuments(documents: Document[]) {
    return await this.documentRepository.remove(documents);
  }
}
