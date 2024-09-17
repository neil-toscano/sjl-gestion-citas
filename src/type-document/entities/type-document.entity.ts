import { Document } from 'src/documents/entities/document.entity';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'type_document' })
export class TypeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @OneToMany(
    () => SectionTypeDocument,
    (sectionTypeDocument) => sectionTypeDocument.typeDocument,
  )
  sectionTypeDocument: SectionTypeDocument[];
}
