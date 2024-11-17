import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SectionDocumentModule } from 'src/section-document/section-document.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { EmailModule } from 'src/email/email.module';
import { ProcessStatusModule } from 'src/process-status/process-status.module';
import { UserPermissionsModule } from 'src/user-permissions/user-permissions.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { AppointmentRepository } from './repository/appointment.repository';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, ...CommandHandlers, AppointmentRepository],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Appointment]),
    AuthModule,
    SectionDocumentModule,
    UserModule,
    ScheduleModule,
    EmailModule,
    ProcessStatusModule,
    UserPermissionsModule,
  ],
  exports: [AppointmentService, TypeOrmModule],
})
export class AppointmentModule {}
