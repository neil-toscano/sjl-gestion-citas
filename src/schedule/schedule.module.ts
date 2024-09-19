import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    AuthModule,
  ],
  exports: [
    ScheduleService,
    TypeOrmModule
  ]
})
export class ScheduleModule {}
