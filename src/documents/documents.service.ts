import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { SectionTypeDocumentService } from 'src/section-type-document/section-type-document.service';
import { User } from 'src/user/entities/user.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly fileService: FilesService,
    private readonly sectionTypeService: SectionTypeDocumentService,
    private readonly sectionService: SectionDocumentService,
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

  async findAll(user: User) {
    return this.documentRepository.find({
      where: { user: { id: user.id } },
      relations: ['sectionTypeDocument'],
    });
  }

  async findDocumentBySection(id: string, user: User) {
    return this.documentRepository.find({
      where: {
        user: { id: user.id },
        sectionTypeDocument: {
          section: {
            id: id,
          },
        },
      },
    });
  }

  async findAllBySection(id: string) {
    return this.documentRepository.find({
      where: {
        sectionTypeDocument: {
          section: {
            id: id,
          },
        },
      },
    });
  }

  async findAllSectionsByUser(id: string) {
    const documents = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.sectionTypeDocument', 'sectionTypeDocument')
      .leftJoinAndSelect('sectionTypeDocument.section', 'sectionDocument')
      .where('document.user.id = :userId') // Aquí se usa el placeholder :userId
      .setParameters({ userId: id }) // Establece el parámetro para :userId
      // .select([
      //   'sectionDocument.id',
      //   'sectionDocument.sectionName',
      //   'sectionDocument.sectionSlug'
      // ])
      .distinct(true)
      .getMany();

    const result = this.groupDocumentsBySection(documents);
    return result;
  }

  findOne(id: string) {
    return `This action returns a #${id} document`;
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
    const document = await this.documentRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    if (Object.keys(updateDocumentDto).length === 0) {
      return { message: 'No data provided for update' };
    }
    if (updateDocumentDto.fileUrl) {
      const response = await this.fileService.deleteFile(document.fileUrl);
    }

    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOneBy({ id });
  }
  remove(id: number) {
    return `This action removes a #${id} document`;
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

  getTypeDocumentCountBySectionId(data: any[], sectionId: string): number {
    const section = data.find((section) => section.sectionId === sectionId);
    if (section) {
      return section.typedocument.length;
    }
    return 0;
  }

  groupDocumentsBySection(documents) {
    // Agrupa los documentos por sección
    const groupedDocuments = documents.reduce((acc, document) => {
      const sectionSlug = document.sectionTypeDocument.section.sectionSlug;

      // Si la sección no está en el acumulador, créala
      if (!acc[sectionSlug]) {
        acc[sectionSlug] = {
          sectionName: document.sectionTypeDocument.section.sectionName,
          sectionSlug: sectionSlug,
          documents: [],
        };
      }

      // Agrega el documento al array de documentos de la sección correspondiente
      acc[sectionSlug].documents.push({
        id: document.id,
        fileUrl: document.fileUrl,
        status: document.status,
        details: document.details,
      });

      return acc;
    }, {});

    // Convierte el objeto agrupado en un array de valores
    return Object.values(groupedDocuments);
  }
}
