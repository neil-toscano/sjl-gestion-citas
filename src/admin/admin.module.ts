import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from 'src/documents/documents.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { SectionDocumentModule } from 'src/section-document/section-document.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    DocumentsModule,
    AssignmentsModule,
    SectionDocumentModule,
    UserModule,
    AuthModule,
    AppointmentModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
