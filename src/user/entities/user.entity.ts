import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { Type } from 'class-transformer';
import { Document } from 'src/documents/entities/document.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { ProcessStatus } from 'src/process-status/entities/process-status.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  documentNumber: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  firstName: string;

  @Column('text')
  apellido_paterno: string;
  
  @Column('text')
  apellido_materno: string;

  // @Column('date')
  // birthDate: Date;

  // @Column('text')
  // department: string;
  @Column('text', { nullable: true})
  district: string;

  @Column('text', { nullable: true})
  address: string;


  @Column({ default: false })
  isVerified: boolean;

  @Column('text', { nullable: true})
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

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

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
}
