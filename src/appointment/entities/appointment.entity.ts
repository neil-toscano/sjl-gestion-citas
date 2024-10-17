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
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

@Entity()
@Unique(['assignedAdmin', 'schedule', 'appointmentDate'])
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
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ManyToOne(() => User, (user) => user.appointments, { nullable: true })
  reservedBy: User;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  schedule: Schedule;

  @ManyToOne(() => User, (user) => user.appointments)
  assignedAdmin: User;

  @Column({ nullable: true })
  message: string;
}
