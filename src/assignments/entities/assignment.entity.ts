import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SectionDocument } from 'src/section-document/entities/section-document.entity';

export enum AssignmentStatus {
  PENDING = 'PENDIENTE',
  COMPLETED = 'COMPLETADO',
  IN_PROGRESS = 'EN_PROGRESO',
  REJECTED = 'RECHAZADO',
}

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => User, (admin) => admin.adminAssignments)
  admin: User;

  @ManyToOne(
    () => SectionDocument,
    (sectionDocument) => sectionDocument.assignments,
  )
  sectionDocument: SectionDocument;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
