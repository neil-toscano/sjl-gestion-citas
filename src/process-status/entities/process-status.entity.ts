import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
