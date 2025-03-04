import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { Document } from 'src/documents/entities/document.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { ProcessStatus } from 'src/process-status/entities/process-status.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import { ProcessUser } from 'src/process-user/entities/process-user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  documentNumber: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  email: string;

  @Exclude()
  @Column('text')
  password: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  firstName: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  apellido_paterno: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  apellido_materno: string;

  // @Column('date')
  // birthDate: Date;

  // @Column('text')
  // department: string;
  @Column('text', { nullable: true, default: null })
  district: string;

  @Column('text', { nullable: true, default: null })
  address: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('text', { nullable: true, default: null })
  mobileNumber: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Document, (document) => document.user)
  document: Document;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email?.toLowerCase().trim() || null; // Aplica trim solo si no es null
    this.mobileNumber = this.mobileNumber?.trim() || null; // Aplica trim solo si no es null
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

  @OneToMany(() => Appointment, (appointment) => appointment.reservedBy)
  appointments: Appointment[];

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];

  @OneToMany(() => Assignment, (assignment) => assignment.admin)
  adminAssignments: Assignment[];

  @OneToMany(() => ProcessStatus, (processStatus) => processStatus.user)
  processStatus: ProcessStatus[];

  @OneToMany(() => UserPermission, (permission) => permission.user)
  permissions: UserPermission[];

  @OneToMany(() => ProcessUser, (assignment) => assignment.user)
  assignments: ProcessStatusUser[];
}
