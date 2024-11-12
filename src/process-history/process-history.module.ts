import { Module } from '@nestjs/common';
import { ProcessHistoryService } from './process-history.service';
import { ProcessHistoryController } from './process-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessHistory } from './entities/process-history.entity';

@Module({
  controllers: [ProcessHistoryController],
  providers: [ProcessHistoryService],
  imports: [TypeOrmModule.forFeature([ProcessHistory])],
})
export class ProcessHistoryModule {}
