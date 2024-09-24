import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  imports: [
    TypeOrmModule.forFeature([Assignment]),
    AuthModule,
    
  ],
})
export class AssignmentsModule {}
