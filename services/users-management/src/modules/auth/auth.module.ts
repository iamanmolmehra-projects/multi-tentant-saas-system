import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuardImpl } from './guards/jwt-auth-impl.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('AUTH_JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
    UsersModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuardImpl],
  exports: [AuthService, JwtAuthGuardImpl],
})
export class AuthModule {}
