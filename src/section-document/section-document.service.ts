import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSectionDocumentDto } from './dto/create-section-document.dto';
import { UpdateSectionDocumentDto } from './dto/update-section-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionDocument } from './entities/section-document.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SectionDocumentService {
  constructor(
    @InjectRepository(SectionDocument)
    private readonly sectionDocumentRepository: Repository<SectionDocument>,
  ) {}

  async create(createSectionDocumentDto: CreateSectionDocumentDto) {

    try {
      const sectionDocument = this.sectionDocumentRepository.create(
        createSectionDocumentDto,
      );

      await this.sectionDocumentRepository.save(sectionDocument);

      return {
        sectionDocument,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async findAll(user: User) {
    const isUser = user.roles.includes('user');

    
    if (isUser) {
      const sections = await this.sectionDocumentRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: {
          isActive: true,
        }
      });
      
      return sections;
    }
    const sections = await this.sectionDocumentRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    
    return sections;
  }

  async findOne(id: string) {
    const schedule = await this.sectionDocumentRepository.findOneBy({
      id: id,
    });

    if (!schedule)
      throw new NotFoundException(`Section-Document with id ${id} not found`);
    return schedule;
  }

  async update(id: string, updateSectionDocumentDto: UpdateSectionDocumentDto) {
    const sectionDocument = await this.findOne(id);

    if (!sectionDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.sectionDocumentRepository.update(id, updateSectionDocumentDto);

    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.sectionDocumentRepository
      .createQueryBuilder()
      .delete()
      .from(SectionDocument)
      .where('id = :id', { id: id })
      .execute();
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
