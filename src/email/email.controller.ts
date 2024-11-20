import { Controller, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  sendSurvey(@Query('email') email: string) {
    return this.emailService.sendSurvey(email);
  }

  @Post('state-change')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  flaggedDocuments(@Query('email') email: string) {
    return this.emailService.sendStateChangeNotification(email);
  }

  @Post('verified-documents')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  verifiedDocuments(@Query('email') email: string) {
    return this.emailService.sendVerifiedNotification(email);
  }
}
