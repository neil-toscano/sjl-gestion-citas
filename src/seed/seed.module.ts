import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { SectionDocumentModule } from 'src/section-document/section-document.module';
import { TypeDocumentModule } from 'src/type-document/type-document.module';
import { SectionTypeDocumentModule } from 'src/section-type-document/section-type-document.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    UserModule,
    ScheduleModule,
    SectionDocumentModule,
    TypeDocumentModule,
    SectionTypeDocumentModule,
  ],
})
export class SeedModule {}
