import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

export enum AppointmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SectionDocument, (section) => section.appointments)
  section: SectionDocument;

  @Column({ type: 'timestamptz', nullable: false })
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.OPEN,
  })
  status: AppointmentStatus;

  @ManyToOne(() => User, (user) => user.appointments, { nullable: true })
  reservedBy: User;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  schedule: Schedule;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRescheduled: boolean;
}
