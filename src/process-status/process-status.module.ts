import { Module } from '@nestjs/common';
import { ProcessStatusService } from './process-status.service';
import { ProcessStatusController } from './process-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessStatus } from './entities/process-status.entity';

@Module({
  controllers: [ProcessStatusController],
  providers: [ProcessStatusService],
  exports: [ProcessStatusService],
  imports: [TypeOrmModule.forFeature([ProcessStatus])],
})
export class ProcessStatusModule {}
