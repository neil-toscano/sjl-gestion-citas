import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessStatusEnum } from '../interfaces/status.enum';
import { ProcessUser } from 'src/process-user/entities/process-user.entity';

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

  @OneToMany(() => ProcessUser, (processUser) => processUser.processStatus)
  processUsers: ProcessUser[];

  @Column({ type: 'enum', enum: ProcessStatusEnum })
  status: ProcessStatusEnum;

  @CreateDateColumn({ type: 'timestamptz' }) // Use timestamptz for timezone-aware timestamp
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // Use timestamptz for timezone-aware timestamp
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRescheduled: boolean;

  @Column({ type: 'boolean', default: false })
  isAssigned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date;
}
