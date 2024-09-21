import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { SectionTypeDocumentModule } from 'src/section-type-document/section-type-document.module';
import { SectionDocumentModule } from 'src/section-document/section-document.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Document]),
    AuthModule,
    FilesModule,
    SectionTypeDocumentModule,
    SectionDocumentModule,
  ],
})
export class DocumentsModule {}
