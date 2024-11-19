import { Controller, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendSurvey(@Query('email') email: string) {
    return this.emailService.sendSurvey(email);
  }

  @Post('state-change')
  flaggedDocuments(@Query('email') email: string) {
    return this.emailService.sendStateChangeNotification(email);
  }

  @Post('verified-documents')
  verifiedDocuments(@Query('email') email: string) {
    return this.emailService.sendVerifiedNotification(email);
  }
}
