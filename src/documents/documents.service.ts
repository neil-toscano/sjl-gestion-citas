import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { SectionTypeDocumentService } from 'src/section-type-document/section-type-document.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly fileService: FilesService,
    private readonly sectionTypeService: SectionTypeDocumentService,
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
        sectionTypeDocument: { section: {
          id: id
        }},  
      },
      
    });
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
    if(updateDocumentDto.fileUrl) {
      const response = await this.fileService.deleteFile(document.fileUrl);
    }


    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOneBy({ id });
  }
  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
