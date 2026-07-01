import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@multi-tenant/shared';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Service health check' })
  check() {
    return {
      status: 'ok',
      service: 'expense-management',
      timestamp: new Date().toISOString(),
    };
  }
}
