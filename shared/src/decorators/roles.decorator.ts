import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../constants/roles.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for an endpoint.
 * Usage: @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.MANAGER)
 */
export const RequireRoles = (...roles: RoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
