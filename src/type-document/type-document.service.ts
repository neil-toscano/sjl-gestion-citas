import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTypeDocumentDto } from './dto/create-type-document.dto';
import { UpdateTypeDocumentDto } from './dto/update-type-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeDocument } from './entities/type-document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeDocumentService {
  constructor(
    @InjectRepository(TypeDocument)
    private readonly typeDocumentRepository: Repository<TypeDocument>,
  ) {}
  async create(createTypeDocumentDto: CreateTypeDocumentDto) {
    try {
      const sectionDocument = this.typeDocumentRepository.create(
        createTypeDocumentDto,
      );

      await this.typeDocumentRepository.save(sectionDocument);

      return {
        sectionDocument,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    const types = await this.typeDocumentRepository.find({});

    return types;
  }

  findOne(id: string) {
    return this.typeDocumentRepository.findOneBy({ id });
  }

  update(id: number, updateTypeDocumentDto: UpdateTypeDocumentDto) {
    return `This action updates a #${id} typeDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeDocument`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
