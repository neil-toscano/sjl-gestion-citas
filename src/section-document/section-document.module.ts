import { Module } from '@nestjs/common';
import { SectionDocumentService } from './section-document.service';
import { SectionDocumentController } from './section-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionDocument } from './entities/section-document.entity';

@Module({
  controllers: [SectionDocumentController],
  providers: [SectionDocumentService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([SectionDocument])],
})
export class SectionDocumentModule {}
