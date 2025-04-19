import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Document } from 'src/documents/entities/document.entity';
import { ProcessStatus } from 'src/process-status/entities/process-status.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { SectionTypeDocument } from 'src/section-type-document/entities/section-type-document.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'section_document' })
export class SectionDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  sectionName: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  sectionSlug?: string;

  @Column('int', {
    default: 0,
    nullable: false,
  })
  requiredDocumentsCount: number;

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
    (sectionTypeDocument) => sectionTypeDocument.section,
  )
  sectionTypeDocument: SectionTypeDocument[];

  @OneToMany(() => Appointment, (appointment) => appointment.section)
  appointments: Appointment[];

  @OneToMany(() => Assignment, (assignment) => assignment.sectionDocument)
  assignments: Assignment[];

  @OneToMany(() => ProcessStatus, (processStatus) => processStatus.section)
  processStatus: ProcessStatus[];

  @OneToMany(() => Document, (document) => document.section)
  documents: Document[];

  @OneToMany(() => UserPermission, (permission) => permission.section)
  permissions: UserPermission[];
}
