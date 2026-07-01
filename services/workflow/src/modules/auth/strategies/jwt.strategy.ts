import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthenticatedUser } from '@multi-tenant/shared';

interface JwtPayload {
  sub: string;
  email: string;
  orgId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_JWT_SECRET') || 'fallback-secret',
    });
  }

  validate(payload: JwtPayload): IAuthenticatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      orgId: payload.orgId,
      roleId: payload.roleId,
      roleName: payload.roleName,
      permissions: payload.permissions,
    };
  }
}
