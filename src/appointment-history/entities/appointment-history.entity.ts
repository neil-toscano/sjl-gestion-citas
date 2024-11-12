import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
