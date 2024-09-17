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
