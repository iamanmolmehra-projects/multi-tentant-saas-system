import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../constants/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for an endpoint.
 * Usage: @RequirePermissions(PermissionEnum.USERS_CREATE)
 */
export const RequirePermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
