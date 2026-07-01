import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuardImpl } from './guards/jwt-auth-impl.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: (cs: ConfigService) => ({ secret: cs.get('AUTH_JWT_SECRET') }) }),
  ],
  providers: [JwtStrategy, JwtAuthGuardImpl],
  exports: [JwtAuthGuardImpl],
})
export class AuthModule {}
