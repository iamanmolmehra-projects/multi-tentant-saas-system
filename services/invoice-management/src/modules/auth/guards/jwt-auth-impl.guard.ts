import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@multi-tenant/shared';

/**
 * Global JWT Auth Guard implementation.
 * Uses Passport's JWT strategy and respects the @Public() decorator.
 */
@Injectable()
export class JwtAuthGuardImpl extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check for service-to-service API key
    const request = context.switchToHttp().getRequest();
    const serviceApiKey = request.headers['x-service-api-key'];
    if (serviceApiKey && serviceApiKey === process.env.INTERNAL_SERVICE_API_KEY) {
      request.user = {
        userId: 'service',
        email: 'internal@service',
        orgId: request.headers['x-org-id'] || '',
        roleId: 'service',
        roleName: 'super_admin',
        permissions: ['*'],
      };
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
