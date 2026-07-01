import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '../constants/permissions.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Guard that validates permission-based access.
 * Checks if the authenticated user has all required permissions.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('Access denied - no user context');
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Access denied. Insufficient permissions.',
      );
    }

    return true;
  }
}
