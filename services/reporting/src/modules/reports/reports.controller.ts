import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthenticatedUser, OrgId, TenantIsolationGuard, RolesGuard, PermissionsGuard, RequirePermissions, PermissionEnum } from '@multi-tenant/shared';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.REPORT_VIEW)
  findAll(@OrgId() orgId: string) { return this.reportsService.findAll(orgId); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.REPORT_GENERATE)
  create(@OrgId() orgId: string, @CurrentUser() user: IAuthenticatedUser, @Body() dto: any) {
    return this.reportsService.create(orgId, user.userId, dto);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.REPORT_GENERATE)
  execute(@OrgId() orgId: string, @Param('id', ParseUUIDPipe) id: string, @Body() params?: any) {
    return this.reportsService.execute(orgId, id, params);
  }

  @Get(':id/executions')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.REPORT_VIEW)
  getExecutions(@OrgId() orgId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.getExecutions(orgId, id);
  }
}
