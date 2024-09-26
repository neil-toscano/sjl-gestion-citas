import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [AppointmentModule]
})
export class CronModule {}
