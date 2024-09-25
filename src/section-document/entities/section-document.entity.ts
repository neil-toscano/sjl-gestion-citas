import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Document } from 'src/documents/entities/document.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
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

  @Column('text', {
    unique: true,
    nullable: true,
  })
  sectionSlug?: string;

  @OneToMany(
    () => SectionTypeDocument,
    (sectionTypeDocument) => sectionTypeDocument.section,
  )
  sectionTypeDocument: SectionTypeDocument[];

  @OneToMany(() => Appointment, (appointment) => appointment.section)
  appointments: Appointment[];

  @OneToMany(() => Assignment, (assignment) => assignment.sectionDocument)
  assignments: Assignment[];
}
