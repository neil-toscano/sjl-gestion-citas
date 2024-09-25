import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [AuthModule]
})
export class EmailModule {}
