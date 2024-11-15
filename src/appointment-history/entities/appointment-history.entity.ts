import { Appointment } from 'src/appointment/entities/appointment.entity';
import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('appointment_history')
export class AppointmentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'platform_user_id' })
  platformUser: User;

  @ManyToOne(() => SectionDocument, { eager: true })
  @JoinColumn({ name: 'section_id' })
  section: SectionDocument;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @OneToOne(() => Appointment, { eager: true })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
