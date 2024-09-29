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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  dni: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('date')
  birthDate: Date;

  @Column('text')
  department: string;

  @Column('text')
  province: string;

  @Column('text')
  district: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('text')
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
    this.email = this.email.toLowerCase().trim();
    this.mobileNumber = this.mobileNumber.trim();
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
}
