import { Module } from '@nestjs/common';
import { SectionTypeDocumentService } from './section-type-document.service';
import { SectionTypeDocumentController } from './section-type-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionTypeDocument } from './entities/section-type-document.entity';

@Module({
  controllers: [SectionTypeDocumentController],
  providers: [SectionTypeDocumentService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([SectionTypeDocument])],
})
export class SectionTypeDocumentModule {}
