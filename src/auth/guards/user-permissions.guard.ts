import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';
import { Permissions } from '../decorators/permissions-protected.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisions = this.reflector.get(Permissions, context.getHandler());
    if (!permisions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    for (const permission of user.permissions) {
      if (permisions.includes(permission)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.firstName} need a valid permission: [${permisions}]`,
    );
  }
}
