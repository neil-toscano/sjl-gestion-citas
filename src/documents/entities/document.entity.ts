import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import { TypeDocument } from 'src/type-document/entities/type-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('pdf_documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => SectionTypeDocument,
    (sectionTypeDocument) => sectionTypeDocument.documents,
  )
  @JoinColumn({ name: 'section_type_document_id' })
  sectionTypeDocument: SectionTypeDocument;

  @ManyToOne(() => User, (user) => user.document)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: ['EN PROCESO', 'VERIFICADO', 'OBSERVADO'],
    default: 'EN PROCESO',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  details?: string;
}
