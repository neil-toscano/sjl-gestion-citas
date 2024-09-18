import { Module } from '@nestjs/common';
import { SectionTypeDocumentService } from './section-type-document.service';
import { SectionTypeDocumentController } from './section-type-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionTypeDocument } from './entities/section-type-document.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SectionTypeDocumentController],
  providers: [SectionTypeDocumentService],
  exports: [TypeOrmModule, SectionTypeDocumentService],
  imports: [TypeOrmModule.forFeature([SectionTypeDocument]), AuthModule],
})
export class SectionTypeDocumentModule {}
