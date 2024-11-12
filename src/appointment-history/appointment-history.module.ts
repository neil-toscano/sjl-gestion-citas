import { Module } from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { AppointmentHistoryController } from './appointment-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentHistory } from './entities/appointment-history.entity';

@Module({
  controllers: [AppointmentHistoryController],
  providers: [AppointmentHistoryService],
  imports: [TypeOrmModule.forFeature([AppointmentHistory])],
})
export class AppointmentHistoryModule {}
