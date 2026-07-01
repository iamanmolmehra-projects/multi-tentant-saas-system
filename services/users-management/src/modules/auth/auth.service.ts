import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IJwtPayload } from '@multi-tenant/shared';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.usersService.findByEmailInternal(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get permissions from role
    const permissions = user.role?.permissions?.map((p) => p.name) || [];

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user.id, user.email, user.orgId, user.roleId, permissions);
  }

  async signup(dto: SignupDto): Promise<{ message: string; userId: string }> {
    // Check if email already exists in this org
    const existing = await this.usersService.findByEmailAndOrg(
      dto.email,
      dto.orgId,
    );
    if (existing) {
      throw new ConflictException('Email already registered in this organization');
    }

    // Determine role
    let roleId = dto.roleId;
    if (!roleId) {
      const defaultRole = await this.rolesService.findDefaultRole(dto.orgId);
      roleId = defaultRole.id;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
      orgId: dto.orgId,
      roleId,
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('AUTH_REFRESH_SECRET'),
      });

      const user = await this.usersService.findByIdInternal(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const permissions = user.role?.permissions?.map((p) => p.name) || [];
      return this.generateTokens(user.id, user.email, user.orgId, user.roleId, permissions);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(
    userId: string,
    email: string,
    orgId: string,
    roleId: string,
    permissions: string[],
  ): TokenResponseDto {
    const payload: IJwtPayload = {
      sub: userId,
      email,
      orgId,
      roleId,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('AUTH_JWT_SECRET'),
      expiresIn: this.configService.get<string>('AUTH_JWT_EXPIRES_IN', '7d'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('AUTH_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('AUTH_REFRESH_EXPIRES_IN', '30d'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('AUTH_JWT_EXPIRES_IN', '7d'),
      tokenType: 'Bearer',
    };
  }
}
