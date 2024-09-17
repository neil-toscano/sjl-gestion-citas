import { Injectable } from '@nestjs/common';
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
    const result = await this.sectionTypeDocumentRepository.createQueryBuilder('sectionTypeDocument')
  .leftJoinAndSelect('sectionTypeDocument.section', 'section')
  .leftJoinAndSelect('sectionTypeDocument.typeDocument', 'typeDocument')
  .select([
    'sectionTypeDocument.id AS sectionTypeDocumentId', // Incluyendo el id de la tabla intermedia
    'section.id AS sectionId',
    'section.sectionName AS sectionName',
    'typeDocument.id AS typeDocumentId',
    'typeDocument.name AS typeDocumentName',
  ])
  .orderBy('section.sectionName', 'ASC')
  .getRawMany();
      return Object.values(this.organizeData(result));
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionTypeDocument`;
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
      const { sectionid, sectionname, typedocumentid, typedocumentname, sectiontypedocumentid } = item;
  
      if (!acc[sectionid]) {
        acc[sectionid] = {
          sectionId: sectionid,
          sectionName: sectionname,
          typedocument: []
        };
      }
  
      // Push the type document with its id, name, and sectionTypeDocumentId
      acc[sectionid].typedocument.push({
        id: typedocumentid,
        name: typedocumentname,
        sectionTypeId: sectiontypedocumentid // Adding the id from the junction table
      });
  
      return acc;
    }, {});
  }
}
