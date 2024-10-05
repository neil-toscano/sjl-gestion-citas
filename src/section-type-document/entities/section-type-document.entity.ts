import { Document } from 'src/documents/entities/document.entity';
import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { TypeDocument } from 'src/type-document/entities/type-document.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('section_type_document')
export class SectionTypeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SectionDocument, (section) => section.sectionTypeDocument, {
    eager: true,
  })
  section: SectionDocument;

  @ManyToOne(
    () => TypeDocument,
    (typeDocument) => typeDocument.sectionTypeDocument,
    { eager: true },
  )
  typeDocument: TypeDocument;
}
