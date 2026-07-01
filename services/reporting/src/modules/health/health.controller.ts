import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@multi-tenant/shared';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public() @Get() @HttpCode(HttpStatus.OK)
  check() { return { status: 'ok', service: 'reporting', timestamp: new Date().toISOString() }; }
}
