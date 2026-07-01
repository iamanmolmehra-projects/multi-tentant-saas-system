import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  CurrentUser,
  IAuthenticatedUser,
  OrgId,
  RequirePermissions,
  PermissionEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { SalaryStructuresService } from './salary-structures.service';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';

@ApiTags('Salary Structures')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'salary-structures', version: '1' })
export class SalaryStructuresController {
  constructor(private readonly salaryStructuresService: SalaryStructuresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Salary structure created' })
  create(
    @OrgId() orgId: string,
    @Body() dto: CreateSalaryStructureDto,
  ) {
    return this.salaryStructuresService.create(orgId, dto);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: String })
  @ApiOkResponse({ description: 'Get current salary structure for user' })
  findCurrentByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @OrgId() orgId: string,
  ) {
    return this.salaryStructuresService.findCurrentByUser(orgId, userId);
  }

  @Get(':userId/history')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: String })
  @ApiOkResponse({ description: 'Get salary structure history for user' })
  findHistoryByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @OrgId() orgId: string,
  ) {
    return this.salaryStructuresService.findHistoryByUser(orgId, userId);
  }
}
