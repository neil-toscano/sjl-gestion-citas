import { Module } from '@nestjs/common';
import { TypeDocumentService } from './type-document.service';
import { TypeDocumentController } from './type-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDocument } from './entities/type-document.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TypeDocumentController],
  providers: [TypeDocumentService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([TypeDocument]), AuthModule],
})
export class TypeDocumentModule {}
