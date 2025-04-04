import { join } from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { SectionDocumentModule } from './section-document/section-document.module';
import { TypeDocumentModule } from './type-document/type-document.module';
import { TypeDocument } from './type-document/entities/type-document.entity';
import { SectionDocument } from './section-document/entities/section-document.entity';
import { SectionTypeDocumentModule } from './section-type-document/section-type-document.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './email/email.module';
import { CronModule } from './cron/cron.module';
import { ProcessStatusModule } from './process-status/process-status.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { ProcessHistoryModule } from './process-history/process-history.module';
import { AppointmentHistoryModule } from './appointment-history/appointment-history.module';
import { NotFoundMiddleware } from './common/middlewares/not-found.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProcessUserModule } from './process-user/process-user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 0,
        limit: 0,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,

      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      useUTC: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    DocumentsModule,

    SectionDocumentModule,

    TypeDocumentModule,

    SectionTypeDocumentModule,

    UserModule,

    ScheduleModule,

    AppointmentModule,

    AssignmentsModule,

    AdminModule,

    EmailModule,

    CronModule,

    ProcessStatusModule,

    UserPermissionsModule,

    ProcessHistoryModule,

    AppointmentHistoryModule,

    ProcessUserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
