import { Module } from '@nestjs/common';
import { ProcessUserService } from './process-user.service';
import { ProcessUserController } from './process-user.controller';

@Module({
  controllers: [ProcessUserController],
  providers: [ProcessUserService]
})
export class ProcessUserModule {}
