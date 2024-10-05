import { forwardRef, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { SectionTypeDocumentModule } from 'src/section-type-document/section-type-document.module';
import { SectionDocumentModule } from 'src/section-document/section-document.module';
import { UserModule } from 'src/user/user.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { EmailModule } from 'src/email/email.module';
import { ProcessStatusModule } from 'src/process-status/process-status.module';
import { TypeDocumentModule } from 'src/type-document/type-document.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [TypeOrmModule, DocumentsService],
  imports: [
    TypeOrmModule.forFeature([Document]),
    AuthModule,
    FilesModule,
    SectionTypeDocumentModule,
    SectionDocumentModule,
    UserModule,
    AssignmentsModule,
    AppointmentModule,
    EmailModule,
    ProcessStatusModule,
    TypeDocumentModule
  ],
})
export class DocumentsModule {}
