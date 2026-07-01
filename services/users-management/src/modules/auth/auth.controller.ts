import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '@multi-tenant/shared';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenResponseDto, description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiConflictResponse({ description: 'Email already exists in organization' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenResponseDto, description: 'Token refreshed' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(dto);
  }
}
