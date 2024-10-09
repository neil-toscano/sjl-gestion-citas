import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionTypeDocumentDto } from './dto/create-section-type-document.dto';
import { UpdateSectionTypeDocumentDto } from './dto/update-section-type-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionTypeDocument } from './entities/section-type-document.entity';
import { Repository } from 'typeorm';
import { SectionType } from './interfaces/document';
import { User } from 'src/user/entities/user.entity';
import { UserPermissionsService } from 'src/user-permissions/user-permissions.service';
import { ProcessStatusService } from 'src/process-status/process-status.service';

@Injectable()
export class SectionTypeDocumentService {
  
  constructor(
    @InjectRepository(SectionTypeDocument)
    private readonly sectionTypeDocumentRepository: Repository<SectionTypeDocument>,
    private readonly userPermissionService: UserPermissionsService,
    private readonly processStatusService: ProcessStatusService,
  ) {}

  create(createSectionTypeDocumentDto: CreateSectionTypeDocumentDto) {
    const { sectionId, typeDocumentId } = createSectionTypeDocumentDto;

    const newSectionTypeDocument = this.sectionTypeDocumentRepository.create({
      section: { id: sectionId },
      typeDocument: { id: typeDocumentId },
    });

    return this.sectionTypeDocumentRepository.save(newSectionTypeDocument);
  }

  async findAll(user: User): Promise<SectionType[]> {
    // console.log(user)
    if (user.roles.includes('user') || user.roles.includes('administrator')) {
      //TODO: Verificar detalladamente

      const statusCounts = await this.processStatusService.countByStatus();

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
      const statusCountMap = statusCounts.reduce((acc, current) => {
        const { sectionId, status, count } = current;
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        acc[sectionId].push({ status, count });
        return acc;
      }, {});

      const organizedData: any[] = Object.values(this.organizeData(result));
      const finalResult = organizedData.map((section) => ({
        ...section,
        statusCounts: statusCountMap[section.sectionId] || [],
      }));

      return finalResult;
    } else if (user.roles.includes('platform-operator')) {
      const permissions = await this.userPermissionService.findByUser(user.id);

      const accessibleSectionIds = permissions
        .filter((permission) => permission.hasAccess)
        .map((permission) => permission.section.id);

      if (accessibleSectionIds.length === 0) {
        return [];
      }

      const statusCounts = await this.processStatusService.countByStatus();

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
        .where('section.id IN (:...accessibleSectionIds)', {
          accessibleSectionIds,
        }) // Filter sections by accessible IDs
        .orderBy('section.sectionName', 'ASC')
        .getRawMany();

      const statusCountMap = statusCounts.reduce((acc, current) => {
        const { sectionId, status, count } = current;
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        acc[sectionId].push({ status, count });
        return acc;
      }, {});

      const organizedData: any[] = Object.values(this.organizeData(result));
      const finalResult = organizedData.map((section) => ({
        ...section,
        statusCounts: statusCountMap[section.sectionId] || [],
      }));

      return finalResult;
    }
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
