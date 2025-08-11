import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: Role } }>();
    const { user } = request;
    if (!user) {
      throw new ForbiddenException('You do not have permission');
    }

    const hasRequiredRole = requiredRoles.some((role) => role === user.role);
    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have permission (roles)');
    }
    return true;
  }
}
