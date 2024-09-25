import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from 'src/documents/documents.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), DocumentsModule, AssignmentsModule],
  controllers: [AdminController],
  providers: [AdminService],

})
export class AdminModule {}
