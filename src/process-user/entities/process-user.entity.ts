import { ProcessStatus } from 'src/process-status/entities/process-status.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProcessUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProcessStatus, (processStatus) => processStatus.processUsers)
  processStatus: ProcessStatus;

  @ManyToOne(() => User, (user) => user.processUsers)
  user: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}