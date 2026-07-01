import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload, IAuthenticatedUser } from '@multi-tenant/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: configService.get('AUTH_JWT_SECRET') });
  }
  async validate(payload: IJwtPayload): Promise<IAuthenticatedUser> {
    if (!payload.sub) throw new UnauthorizedException();
    return { userId: payload.sub, email: payload.email, orgId: payload.orgId, roleId: payload.roleId, roleName: '', permissions: payload.permissions || [] };
  }
}
