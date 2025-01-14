import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { TypeDocumentService } from 'src/type-document/type-document.service';
import { SectionTypeDocumentService } from 'src/section-type-document/section-type-document.service';
import { CreateSectionTypeDocumentDto } from 'src/section-type-document/dto/create-section-type-document.dto';
@Injectable()
export class SeedService {
  constructor(
    private readonly sectionService: SectionDocumentService,
    private readonly typeDocumentService: TypeDocumentService,
    private readonly sectionTypeDocumentService: SectionTypeDocumentService,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) { }

  async runSeedSchedule() {
    const schedules = [
      // { startTime: '08:00', endTime: '09:00' },
      // { startTime: '09:00', endTime: '10:00' },
      // { startTime: '10:00', endTime: '11:00' },
      // { startTime: '11:00', endTime: '12:00' },
      { startTime: '12:00', endTime: '13:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '16:00', endTime: '17:00' },
    ];

    for (const schedule of schedules) {
      await this.scheduleRepository.save(schedule);
    }
    return 'success';
  }

  async runSeedSections() {
    const sections = [
      {
        sectionName: 'SUCESIÓN INTESTADA',
        sectionSlug: 'sucesion-intestada',
        requiredDocumentsCount: 3,
      },
      {
        sectionName: 'INSCRIPCIÓN DE SUBDIVISIÓN DE LOTES',
        sectionSlug: 'inscripcion-de-subdivision-de-lotes',
        requiredDocumentsCount: 3,
      },
      {
        sectionName: 'INSCRIPCIÓN DE INDEPENDIZACIÓN',
        sectionSlug: 'inscripcion-de-independizacion',
        requiredDocumentsCount: 3,
      },
    ];

    const createdSections = [];
    for (const section of sections) {
      const createdSection = await this.sectionService.create(section);
      createdSections.push(createdSection);
    }
    return createdSections;
  }

  async runSeedTypeDocument() {
    const typeDocuments = [
      { name: 'Copia de DNI' },
      { name: 'Copia literal de las unidades a independizar' },
      { name: 'Copia literal insertada en la sucesión intestada' },
      { name: 'Copia literal o partida electrónica de todos los asientos' },
      { name: 'Copia literal de las unidades subdivididas o membretadas' },
      { name: 'Sucesión intestada inscrita en SUNARP' },
      { name: 'Documento que acredite la titularidad del fallecido' },
      { name: 'Copia DNI de los herederos' },
    ];

    const createdTypeDocuments = [];
    for (const typeDocument of typeDocuments) {
      const createdTypeDocument =
        await this.typeDocumentService.create(typeDocument);
      createdTypeDocuments.push(createdTypeDocument);
    }
    return createdTypeDocuments;
  }

  async runSeedSectionTypeDocuments() {
    const sections = await this.runSeedSections();
    const typeDocuments = await this.runSeedTypeDocument();

    // Asocia secciones con documentos
    const associations = [
      {
        section: sections[0].sectionDocument,
        typeDocuments: [
          typeDocuments[5].sectionDocument,
          typeDocuments[6].sectionDocument,
          typeDocuments[7].sectionDocument,
        ],
      }, // Acceder a sectionDocument de ambos
      {
        section: sections[1].sectionDocument,
        typeDocuments: [
          typeDocuments[3].sectionDocument,
          typeDocuments[4].sectionDocument,
          typeDocuments[7].sectionDocument,
        ],
      },
      {
        section: sections[2].sectionDocument,
        typeDocuments: [
          typeDocuments[3].sectionDocument,
          typeDocuments[1].sectionDocument,
          typeDocuments[0].sectionDocument,
        ],
      },
    ];

    for (const association of associations) {
      for (const typeDocument of association.typeDocuments) {
        const sectionType: CreateSectionTypeDocumentDto = {
          sectionId: association.section.id, // Acceder a sectionDocument.id
          typeDocumentId: typeDocument.id, // Acceder a sectionDocument.id en typeDocuments
        };

        await this.sectionTypeDocumentService.create(sectionType);
      }
    }
    return 'ejecutado correctamente';
  }
}
