import { Module } from '@nestjs/common';
import { ProcessStatusService } from './process-status.service';
import { ProcessStatusController } from './process-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessStatus } from './entities/process-status.entity';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { CommandHandlers } from './commands/handlers';
import { ProcessStatusRepository } from './repository/process-status.repository';
import { QueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [ProcessStatusController],
  providers: [
    ProcessStatusService,
    ...CommandHandlers,
    ...QueryHandlers,
    ProcessStatusRepository,
  ],
  exports: [ProcessStatusService],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProcessStatus]),
    AssignmentsModule,
    ProcessStatusModule,
  ],
})
export class ProcessStatusModule {}
