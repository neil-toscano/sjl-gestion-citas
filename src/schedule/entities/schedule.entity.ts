import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum ScheduleStatus {
  OPEN = 'ABIERTO',
  CLOSED = 'FINALIZADO',
}

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @ManyToOne(() => SectionDocument, (section) => section.schedules)
  section: SectionDocument;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.OPEN,
  })
  status: ScheduleStatus;

  @ManyToOne(() => User, (user) => user.schedules, { nullable: true })
  reservedBy: User;
}
