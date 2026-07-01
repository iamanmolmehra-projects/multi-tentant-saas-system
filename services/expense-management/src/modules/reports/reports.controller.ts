import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  ApiTags,
} from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  CurrentUser,
  IAuthenticatedUser,
  OrgId,
  RequirePermissions,
  PermissionEnum,
  PaginationQueryDto,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

class QueryReportsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'submitted' })
  @IsOptional()
  @IsString()
  status?: string;
}

@ApiTags('Expense Reports')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.EXPENSE_CREATE)
  @ApiCreatedResponse({ description: 'Report created' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.create(orgId, user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiOkResponse({ description: 'List reports for current user' })
  findAll(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Query() query: QueryReportsDto,
  ) {
    return this.reportsService.findAll(orgId, user.userId, query);
  }

  @Get('org')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_APPROVE)
  @ApiOkResponse({ description: 'List all reports in the organization (manager/admin)' })
  findAllForOrg(
    @OrgId() orgId: string,
    @Query() query: QueryReportsDto,
  ) {
    return this.reportsService.findAllForOrg(orgId, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get report by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.reportsService.findById(id, orgId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_CREATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Report submitted for approval' })
  submit(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.reportsService.submit(id, orgId, user.userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_APPROVE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Report approved' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.reportsService.approve(id, orgId, user.userId);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_APPROVE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Report rejected' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.reportsService.reject(id, orgId, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PermissionEnum.EXPENSE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Report deleted' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.reportsService.delete(id, orgId, user.userId);
  }
}
