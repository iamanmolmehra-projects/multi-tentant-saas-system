import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthenticatedUser, OrgId, TenantIsolationGuard, RolesGuard } from '@multi-tenant/shared';
import { DashboardsService } from './dashboards.service';

@ApiTags('Dashboards')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard)
@Controller({ path: 'dashboards', version: '1' })
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('widgets')
  @HttpCode(HttpStatus.OK)
  findWidgets(@OrgId() orgId: string, @CurrentUser() user: IAuthenticatedUser) {
    return this.dashboardsService.findWidgets(orgId, user.userId);
  }

  @Post('widgets')
  @HttpCode(HttpStatus.CREATED)
  createWidget(@OrgId() orgId: string, @CurrentUser() user: IAuthenticatedUser, @Body() dto: any) {
    return this.dashboardsService.createWidget(orgId, user.userId, dto);
  }

  @Patch('widgets/:id')
  @HttpCode(HttpStatus.OK)
  updateWidget(@OrgId() orgId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: any) {
    return this.dashboardsService.updateWidget(id, orgId, dto);
  }

  @Delete('widgets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteWidget(@OrgId() orgId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.dashboardsService.deleteWidget(id, orgId);
  }

  @Get('data/:widgetId')
  @HttpCode(HttpStatus.OK)
  getWidgetData(@OrgId() orgId: string, @Param('widgetId', ParseUUIDPipe) widgetId: string) {
    return this.dashboardsService.getWidgetData(orgId, widgetId);
  }
}
