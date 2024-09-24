import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

 @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;
}
