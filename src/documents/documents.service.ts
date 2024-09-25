import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
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

    const result = this.groupDocumentsBySection(documents);
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

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOne(id);

    if (Object.keys(updateDocumentDto).length === 0) {
      return { message: 'No data provided for update' };
    }
    if (updateDocumentDto.fileUrl) {
      const response = this.fileService.deleteFile(document.fileUrl);
    }

    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOneBy({ id });
  }

  async hasValidDocuments(id: string, user: User) {
    await this.sectionService.findOne(id);
    const sectionDocuments = await this.findDocumentBySection(id, user);
    const result = await this.sectionTypeService.findAll();
    const sectionDocumentCount = this.getTypeDocumentCountBySectionId(
      result,
      id,
    );

    if (sectionDocuments.length !== sectionDocumentCount) {
      return {
        ok: false,
        msg: 'No tiene subido todos los documentos en la sección',
      };
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

  async verifyDocumentsComplete(user: User, sectionId: string) {
    await this.sectionService.findOne(sectionId);
    const sectionDocuments = await this.findDocumentBySection(sectionId, user);
    const result = await this.sectionTypeService.findAll();
    const sectionDocumentCount = this.getTypeDocumentCountBySectionId(
      result,
      sectionId,
    );

    if (sectionDocuments.length !== sectionDocumentCount) {
      return {
        ok: false,
        msg: 'No tiene subido todos los documentos en la sección',
      };
    }

    const allVerified = sectionDocuments.every(
      (document) => document.status === 'EN PROCESO',
    );
    if (!allVerified) {
      return {
        ok: false,
        msg: 'Sus documentos ya pasaron la etapa de "EN PROCESO"',
      };
    }

    return {
      ok: true,
      msg: 'Esta listo para ser asignado a un admin',
    };
  }
  // async findDocumentBySection(id: string, user: User) {
  //   return this.documentRepository.find({
  //     where: {
  //       user: { id: user.id },
  //       sectionTypeDocument: {
  //         section: {
  //           id: id,
  //         },
  //       },
  //     },
  //   });
  // }

  async findDocumentBySection(id: string, user: User) {
    return this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.sectionTypeDocument', 'sectionTypeDocument')
      .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument') // Realiza el JOIN con typeDocument
      .leftJoin('document.user', 'user') // Realiza el JOIN con la entidad User
      .where('user.id = :userId', { userId: user.id }) // Filtra por el ID del usuario
      .andWhere('sectionTypeDocument.section.id = :sectionId', {
        sectionId: id,
      }) // Filtra por el ID de la sección
      .getMany(); // O getOne() si esperas un solo resultado
  }

  getTypeDocumentCountBySectionId(data: any[], sectionId: string): number {
    const section = data.find((section) => section.sectionId === sectionId);
    if (section) {
      return section.typedocument.length;
    }
    return 0;
  }

  groupDocumentsBySection(documents: Document[]) {
    // Creamos un objeto para almacenar las secciones agrupadas
    const groupedBySection: { [key: string]: any } = {};

    documents.forEach((doc) => {
      const sectionId = doc.sectionTypeDocument.section.id;
      const sectionName = doc.sectionTypeDocument.section.sectionName;
      const typeDocumentName = doc.sectionTypeDocument.typeDocument.name;

      // Si la sección aún no existe en el objeto agrupado, la inicializamos
      if (!groupedBySection[sectionId]) {
        groupedBySection[sectionId] = {
          sectionName: sectionName,
          documents: [],
        };
      }

      // Añadimos el documento a la lista de documentos de esa sección
      groupedBySection[sectionId].documents.push({
        id: doc.id,
        fileUrl: doc.fileUrl,
        status: doc.status,
        typeDocument: typeDocumentName,
      });
    });

    // Convertimos el objeto agrupado a un array si se necesita un formato más accesible
    return Object.values(groupedBySection);
  }

  async readyForReviewBySection(idSection: string) {
    await this.sectionService.findOne(idSection);

    const users = await this.userService.findAll();

    const sectionTypes = await this.sectionTypeService.findAll();
    const sectionDocumentCount = this.getTypeDocumentCountBySectionId(
      sectionTypes,
      idSection,
    );

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

      if (sectionDocuments.length !== sectionDocumentCount) {
        continue;
      }

      const allVerified = sectionDocuments.every(
        (document) => document.status === 'EN PROCESO',
      );

      if (allVerified) {
        validUsers.push(user);
      }
    }

    return validUsers.length > 0 ? [validUsers[0]] : [];
  }
}
