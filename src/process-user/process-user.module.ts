import { Module } from '@nestjs/common';
import { ProcessUserService } from './process-user.service';
import { ProcessUserController } from './process-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessUser } from './entities/process-user.entity';
import { UserModule } from 'src/user/user.module';
import { ProcessStatusModule } from 'src/process-status/process-status.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessUser]), UserModule, ProcessStatusModule],
  controllers: [ProcessUserController],
  providers: [ProcessUserService]
})
export class ProcessUserModule {}
