import { Controller, Post } from '@nestjs/common';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('schedule')
  @Auth(ValidRoles.admin)
  executeSeedSchedule() {
    return this.seedService.runSeedSchedule();
  }

  @Post('sections')
  @Auth(ValidRoles.admin)
  executeSeedSections() {
    return this.seedService.runSeedSections();
  }

  @Post('type-documents')
  @Auth(ValidRoles.admin)
  executeTypeDocuments() {
    return this.seedService.runSeedTypeDocument();
  }
  @Post('section-types')
  @Auth(ValidRoles.admin)
  executeSectionTypes() {
    return this.seedService.runSeedSectionTypeDocuments();
  }
}
