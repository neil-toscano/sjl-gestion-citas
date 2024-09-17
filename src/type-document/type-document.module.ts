import { Module } from '@nestjs/common';
import { TypeDocumentService } from './type-document.service';
import { TypeDocumentController } from './type-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDocument } from './entities/type-document.entity';

@Module({
  controllers: [TypeDocumentController],
  providers: [TypeDocumentService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([TypeDocument])],
})
export class TypeDocumentModule {}
