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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  OrgId,
  RequirePermissions,
  RequireRoles,
  PermissionEnum,
  RoleEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@ApiTags('Workflow Templates')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'templates', version: '1' })
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @ApiCreatedResponse({ description: 'Workflow template created' })
  create(@OrgId() orgId: string, @Body() dto: CreateTemplateDto) {
    return this.templatesService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List all workflow templates' })
  findAll(@OrgId() orgId: string) {
    return this.templatesService.findAll(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get workflow template by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.templatesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Workflow template updated (version incremented)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.templatesService.update(id, orgId, dto);
  }
}
