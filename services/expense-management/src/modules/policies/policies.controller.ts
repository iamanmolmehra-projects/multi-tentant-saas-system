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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
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
import { PoliciesService } from './policies.service';

class CreatePolicyDto {
  @ApiProperty({ example: 'Travel Expense Limit' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-role' })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({ example: 50000.0 })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: 'monthly', description: 'daily | weekly | monthly | quarterly | yearly' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  period?: string;

  @ApiPropertyOptional({ example: 500.0 })
  @IsOptional()
  @IsNumber()
  requiresReceiptAbove?: number;

  @ApiPropertyOptional({ example: 200.0 })
  @IsOptional()
  @IsNumber()
  autoApproveBelow?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ApiTags('Expense Policies')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'policies', version: '1' })
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_CREATE)
  @ApiCreatedResponse({ description: 'Policy created' })
  create(@OrgId() orgId: string, @Body() dto: CreatePolicyDto) {
    return this.policiesService.create(orgId, {
      name: dto.name,
      categoryId: dto.categoryId || null,
      roleId: dto.roleId || null,
      maxAmount: dto.maxAmount ?? null,
      currency: dto.currency || 'INR',
      period: dto.period || null,
      requiresReceiptAbove: dto.requiresReceiptAbove ?? null,
      autoApproveBelow: dto.autoApproveBelow ?? null,
      isActive: dto.isActive ?? true,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiOkResponse({ description: 'List all policies' })
  findAll(@OrgId() orgId: string) {
    return this.policiesService.findAll(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get policy by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.policiesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Policy updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: Partial<CreatePolicyDto>,
  ) {
    return this.policiesService.update(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Policy deleted' })
  delete(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.policiesService.delete(id, orgId);
  }
}
