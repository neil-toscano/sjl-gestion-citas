import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsController } from './user-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
  imports: [TypeOrmModule.forFeature([UserPermission]), AuthModule],
  exports: [UserPermissionsService],
})
export class UserPermissionsModule {}
