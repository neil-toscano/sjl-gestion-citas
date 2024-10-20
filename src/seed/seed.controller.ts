import { Controller, Get, Post } from '@nestjs/common';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth( ValidRoles.admin )
  executeSeed() {
    return this.seedService.runSeed();
  }

  @Post('schedule')
  executeSeedSchedule() {
    return this.seedService.runSeedSchedule();
  }

  @Post('sections')
  executeSeedSections() {
    return this.seedService.runSeedSections();
  }

  @Post('type-documents')
  executeTypeDocuments() {
    return this.seedService.runSeedTypeDocument();
  }
  @Post('section-types')
  executeSectionTypes() {
    return this.seedService.runSeedSectionTypeDocuments();
  }
}
