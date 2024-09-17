import { Document } from 'src/documents/entities/document.entity';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'section_document' })
export class SectionDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  sectionName: string;

  @OneToMany(
    () => SectionTypeDocument,
    (sectionTypeDocument) => sectionTypeDocument.section,
  )
  sectionTypeDocument: SectionTypeDocument[];
}
