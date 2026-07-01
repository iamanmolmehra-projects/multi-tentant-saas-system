import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  IAuthenticatedUser,
  OrgId,
  RequirePermissions,
  RequireRoles,
  PermissionEnum,
  RoleEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(RolesGuard, PermissionsGuard)
@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.ORG_CREATE)
  @ApiCreatedResponse({ description: 'Organization created' })
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(dto, user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.ORG_READ)
  @ApiOkResponse({ description: 'Get organization' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    // Users can only view their own org
    const targetId = id === 'me' ? orgId : id;
    return this.organizationsService.findById(targetId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ORG_ADMIN)
  @RequirePermissions(PermissionEnum.ORG_UPDATE)
  @ApiOkResponse({ description: 'Organization updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, dto, user.userId);
  }

  @Get(':id/children')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ORG_ADMIN)
  @RequirePermissions(PermissionEnum.ORG_READ)
  @ApiOkResponse({ description: 'Get child organizations' })
  getChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.getChildren(id);
  }
}
