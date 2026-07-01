import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  OrgId,
  RequireRoles,
  RoleEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { RulesService } from './rules.service';
import { EscalationRuleEntity } from './entities/escalation-rule.entity';

@ApiTags('Escalation Rules')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'rules', version: '1' })
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @ApiCreatedResponse({ description: 'Escalation rule created' })
  create(@OrgId() orgId: string, @Body() dto: Partial<EscalationRuleEntity>) {
    return this.rulesService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'templateId', required: true, type: String })
  @ApiOkResponse({ description: 'List escalation rules for a template' })
  findAll(
    @OrgId() orgId: string,
    @Query('templateId', ParseUUIDPipe) templateId: string,
  ) {
    return this.rulesService.findAllByTemplate(orgId, templateId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get escalation rule by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.rulesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Escalation rule updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: Partial<EscalationRuleEntity>,
  ) {
    return this.rulesService.update(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Escalation rule deleted' })
  delete(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.rulesService.delete(id, orgId);
  }
}
