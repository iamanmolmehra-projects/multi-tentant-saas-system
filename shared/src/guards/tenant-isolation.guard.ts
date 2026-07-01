import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Guard that enforces tenant isolation.
 * Ensures users can only access resources within their own organization.
 * Checks orgId in route params, query params, and request body.
 */
@Injectable()
export class TenantIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser;

    if (!user || !user.orgId) {
      throw new ForbiddenException('Organization context required');
    }

    // Check route params for orgId mismatch
    const paramOrgId = request.params?.orgId;
    if (paramOrgId && paramOrgId !== user.orgId) {
      throw new ForbiddenException(
        'Access denied - cross-tenant access is not allowed',
      );
    }

    // Check query params for orgId mismatch
    const queryOrgId = request.query?.orgId;
    if (queryOrgId && queryOrgId !== user.orgId) {
      throw new ForbiddenException(
        'Access denied - cross-tenant access is not allowed',
      );
    }

    // Check body for orgId mismatch
    const bodyOrgId = request.body?.orgId;
    if (bodyOrgId && bodyOrgId !== user.orgId) {
      throw new ForbiddenException(
        'Access denied - cross-tenant access is not allowed',
      );
    }

    return true;
  }
}
