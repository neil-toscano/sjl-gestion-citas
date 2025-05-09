import { Module } from '@nestjs/common';
import { ProcessUserService } from './process-user.service';
import { ProcessUserController } from './process-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessUser } from './entities/process-user.entity';
import { UserModule } from 'src/user/user.module';
import { ProcessStatusModule } from 'src/process-status/process-status.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessUser]), UserModule, ProcessStatusModule, AppointmentModule],
  controllers: [ProcessUserController],
  providers: [ProcessUserService],
  exports: [ProcessUserService]
})
export class ProcessUserModule {}
