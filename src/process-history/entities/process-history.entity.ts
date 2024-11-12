import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProcessHistoryStatus } from '../interface/process-history.enum';

@Entity('process_history')
export class ProcessHistory {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => SectionDocument, { eager: true })
  @JoinColumn({ name: 'section_id' })
  section: SectionDocument;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProcessHistoryStatus,
  })
  state: ProcessHistoryStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'platform_user_id' })
  platformUser: User;
}
