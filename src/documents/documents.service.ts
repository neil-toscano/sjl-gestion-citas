import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly fileService: FilesService,
  ) {}
  async create(user: User, createDocumentDto: CreateDocumentDto) {
    const newDocument = this.documentRepository.create({
      sectionTypeDocument: { id: createDocumentDto.sectionTypeId },
      user: user, 
      fileUrl: createDocumentDto.fileUrl,
    });

    return await this.documentRepository.save(newDocument);
  }

  async findAll(user:User) {
    return this.documentRepository.find({
      where: { user: { id: user.id } },
      relations: ['sectionTypeDocument'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }


  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.documentRepository.findOneBy({ id });
    
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    const response = await this.fileService.deleteFile(document.fileUrl);
  
    if (Object.keys(updateDocumentDto).length === 0) {
      return { message: 'No data provided for update' };
    }
  
    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOneBy({id});
  }
  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
