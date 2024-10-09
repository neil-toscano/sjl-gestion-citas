import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsController } from './user-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permission.entity';

@Module({
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
  imports: [TypeOrmModule.forFeature([UserPermission])],
})
export class UserPermissionsModule {}
