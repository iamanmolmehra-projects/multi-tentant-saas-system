import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthenticatedUser, TenantIsolationGuard } from '@multi-tenant/shared';
import { PreferencesService } from './preferences.service';

@ApiTags('Notification Preferences')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard)
@Controller({ path: 'notification-preferences', version: '1' })
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: IAuthenticatedUser) {
    return this.preferencesService.findByUser(user.userId, user.orgId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  upsert(@CurrentUser() user: IAuthenticatedUser, @Body() dto: any) {
    return this.preferencesService.upsert(user.userId, user.orgId, dto);
  }
}
