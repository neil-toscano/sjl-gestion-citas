import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionTypeDocumentDto } from './dto/create-section-type-document.dto';
import { UpdateSectionTypeDocumentDto } from './dto/update-section-type-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionTypeDocument } from './entities/section-type-document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionTypeDocumentService {
  constructor(
    @InjectRepository(SectionTypeDocument)
    private readonly sectionTypeDocumentRepository: Repository<SectionTypeDocument>,
  ) {}
  create(createSectionTypeDocumentDto: CreateSectionTypeDocumentDto) {
    const { sectionId, typeDocumentId } = createSectionTypeDocumentDto;

    const newSectionTypeDocument = this.sectionTypeDocumentRepository.create({
      section: { id: sectionId },
      typeDocument: { id: typeDocumentId },
    });

    return this.sectionTypeDocumentRepository.save(newSectionTypeDocument);
  }

  async findAll() {
    //TODO: Verificar detalladamente
    const result = await this.sectionTypeDocumentRepository
      .createQueryBuilder('sectionTypeDocument')
      .leftJoinAndSelect('sectionTypeDocument.section', 'section')
      .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument')
      .select([
        'sectionTypeDocument.id AS sectionTypeDocumentId',
        'section.id AS sectionId',
        'section.sectionName AS sectionName',
        'section.sectionSlug AS sectionSlug',
        'typeDocument.id AS typeDocumentId',
        'typeDocument.name AS typeDocumentName',
      ])
      .orderBy('section.sectionName', 'ASC')
      .getRawMany();
    return Object.values(this.organizeData(result));
  }

  async findOne(id: string) {
    const result = await this.sectionTypeDocumentRepository.findOne({
      where: { id: id },
      relations: ['section'], // Incluir la relación con la entidad Section
    });

    if (!result) {
      throw new NotFoundException(`Section-Type id ${id} not found`);
    }
    return result;
  }

  update(
    id: number,
    updateSectionTypeDocumentDto: UpdateSectionTypeDocumentDto,
  ) {
    return `This action updates a #${id} sectionTypeDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionTypeDocument`;
  }

  organizeData(data: any) {
    return data.reduce((acc: any, item: any) => {
      const {
        sectionid,
        sectionname,
        sectionslug,
        typedocumentid,
        typedocumentname,
        sectiontypedocumentid,
      } = item;

      if (!acc[sectionid]) {
        acc[sectionid] = {
          sectionId: sectionid,
          sectionName: sectionname,
          sectionSlug: sectionslug,
          typedocument: [],
        };
      }

      // Push the type document with its id, name, and sectionTypeDocumentId
      acc[sectionid].typedocument.push({
        id: typedocumentid,
        name: typedocumentname,
        sectionTypeId: sectiontypedocumentid, // Adding the id from the junction table
      });

      return acc;
    }, {});
  }
}
