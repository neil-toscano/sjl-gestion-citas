import { Document } from 'src/documents/entities/document.entity';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'type_document' })
export class TypeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => SectionTypeDocument,
    (sectionTypeDocument) => sectionTypeDocument.typeDocument,
  )
  sectionTypeDocument: SectionTypeDocument[];

  @OneToMany(() => Document, (document) => document.typeDocument)
  documents: Document[];
}
