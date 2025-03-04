import { ProcessStatus } from 'src/process-status/entities/process-status.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProcessUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProcessStatus, (processStatus) => processStatus.assignments)
  @JoinColumn({ name: 'process_status_id' })
  processStatus: ProcessStatus;

  @ManyToOne(() => User, (user) => user.assignments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}