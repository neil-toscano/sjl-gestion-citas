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
  ],
})
export class DocumentsModule {}
