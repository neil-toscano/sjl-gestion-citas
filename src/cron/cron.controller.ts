import { Controller, Get } from '@nestjs/common';
import { CronService } from './cron.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  findAll() {
    return this.cronService.expiredAppoinments();
  }
}
