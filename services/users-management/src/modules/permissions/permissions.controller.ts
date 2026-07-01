import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard, RequireRoles, RoleEnum } from '@multi-tenant/shared';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ path: 'permissions', version: '1' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ORG_ADMIN)
  @ApiOkResponse({ description: 'List all permissions' })
  findAll(@Query('module') module?: string) {
    if (module) {
      return this.permissionsService.findByModule(module);
    }
    return this.permissionsService.findAll();
  }
}
