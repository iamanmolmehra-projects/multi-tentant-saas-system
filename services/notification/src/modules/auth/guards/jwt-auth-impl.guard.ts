import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@multi-tenant/shared';

@Injectable()
export class JwtAuthGuardImpl extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const serviceApiKey = request.headers['x-service-api-key'];
    if (serviceApiKey && serviceApiKey === process.env.INTERNAL_SERVICE_API_KEY) {
      request.user = { userId: 'service', email: 'internal@service', orgId: request.headers['x-org-id'] || '', roleId: 'service', roleName: 'super_admin', permissions: ['*'] };
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error | null, user: unknown) {
    if (err || !user) throw err || new UnauthorizedException();
    return user;
  }
}
