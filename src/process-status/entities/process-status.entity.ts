import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessStatusEnum } from '../interfaces/status.enum';

@Entity({ name: 'process-status' })
export class ProcessStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.processStatus)
  user: User;

  @ManyToOne(
    () => SectionDocument,
    (sectionDocument) => sectionDocument.processStatus,
  )
  section: SectionDocument;

  @Column({ type: 'enum', enum: ProcessStatusEnum })
  status: ProcessStatusEnum;

  @CreateDateColumn({ type: 'timestamptz' }) // Use timestamptz for timezone-aware timestamp
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // Use timestamptz for timezone-aware timestamp
  updatedAt: Date;
}
