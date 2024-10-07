import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { AdminModule } from 'src/admin/admin.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [AppointmentModule, AdminModule, EmailModule],
})
export class CronModule {}
