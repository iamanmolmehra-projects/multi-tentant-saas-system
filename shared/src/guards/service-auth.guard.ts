import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard for service-to-service communication.
 * Validates the internal service API key in the x-service-api-key header.
 */
@Injectable()
export class ServiceAuthGuard implements CanActivate {
  private readonly serviceApiKey: string;

  constructor() {
    this.serviceApiKey = process.env.INTERNAL_SERVICE_API_KEY || '';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-service-api-key'];

    if (!apiKey || apiKey !== this.serviceApiKey) {
      throw new UnauthorizedException(
        'Invalid or missing service API key',
      );
    }

    return true;
  }
}
