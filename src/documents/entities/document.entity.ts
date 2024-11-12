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
import { DocumentStatus } from '../dto/create-document.dto';

@Entity('pdf_documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => SectionDocument,
    (sectionDocument) => sectionDocument.documents,
  )
  @JoinColumn({ name: 'section_id' })
  section: SectionDocument;

  @ManyToOne(() => TypeDocument, (typeDocument) => typeDocument.documents)
  @JoinColumn({ name: 'type_document_id' })
  typeDocument: TypeDocument;

  @ManyToOne(() => User, (user) => user.document)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus, // Usar el enum en lugar de valores de cadena directamente
    default: DocumentStatus.EN_PROCESO,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
