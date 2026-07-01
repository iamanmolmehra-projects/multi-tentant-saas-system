import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constants/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Guard that validates role-based access.
 * Checks if the authenticated user has one of the required roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('Access denied - no user context');
    }

    const hasRole = requiredRoles.some(
      (role) => user.roleName === role,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
