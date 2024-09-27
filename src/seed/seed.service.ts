import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { TypeDocumentService } from 'src/type-document/type-document.service';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import { SectionTypeDocumentService } from 'src/section-type-document/section-type-document.service';
import { CreateSectionDocumentDto } from 'src/section-document/dto/create-section-document.dto';
import { CreateSectionTypeDocumentDto } from 'src/section-type-document/dto/create-section-type-document.dto';
@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly sectionService: SectionDocumentService,
    private readonly typeDocumentService: TypeDocumentService,
    private readonly sectionTypeDocumentService: SectionTypeDocumentService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  async runSeedSchedule() {
    const schedules = [
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '11:00', endTime: '12:00' },
    ];

    for (const schedule of schedules) {
      await this.scheduleRepository.save(schedule);
    }
    return 'success';
  }
  
  async runSeedSections() {
    const sections = [
      { sectionName: 'SUCESIÓN INTESTADA', sectionSlug: 'sucesion-intestada' },
      { sectionName: 'INSCRIPCIÓN DE SUBDIVISIÓN DE LOTES', sectionSlug: 'inscripcion-de-subdivision-de-lotes' },
      { sectionName: 'INSCRIPCIÓN DE INDEPENDIZACIÓN', sectionSlug: 'inscripcion-de-independizacion' },
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
      { name: 'Copia de DNI'},
      { name: 'Copia literal de las unidades a independizar'},
      { name: 'Copia literal insertada en la sucesión intestada'},
      { name: 'Copia literal o partida electrónica todos los asientos'},
      { name: 'Copia literal de las unidades subdivididas o membretadas'},
      { name: 'DNI de los herederos'},
    ];
  
    const createdTypeDocuments = [];
    for (const typeDocument of typeDocuments) {
      const createdTypeDocument = await this.typeDocumentService.create(typeDocument);
      createdTypeDocuments.push(createdTypeDocument);
    }
    return createdTypeDocuments;
  }

  async runSeedSectionTypeDocuments() {
    const sections = await this.runSeedSections(); 
    const typeDocuments = await this.runSeedTypeDocument();  
  
    // Asocia secciones con documentos
    const associations = [
      { section: sections[0].sectionDocument, typeDocuments: [typeDocuments[2].sectionDocument, typeDocuments[5].sectionDocument] }, // Acceder a sectionDocument de ambos
      { section: sections[1].sectionDocument, typeDocuments: [typeDocuments[3].sectionDocument, typeDocuments[4].sectionDocument, typeDocuments[5].sectionDocument] },
      { section: sections[2].sectionDocument, typeDocuments: [typeDocuments[3].sectionDocument, typeDocuments[1].sectionDocument, typeDocuments[0].sectionDocument] },
    ];
  
    for (const association of associations) {
      for (const typeDocument of association.typeDocuments) {
        const sectionType: CreateSectionTypeDocumentDto = {
          sectionId: association.section.id,     // Acceder a sectionDocument.id
          typeDocumentId: typeDocument.id,       // Acceder a sectionDocument.id en typeDocuments
        };
  
        await this.sectionTypeDocumentService.create(sectionType);
      }
    }
    return "ejecutado correctamente";
  }
  
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
