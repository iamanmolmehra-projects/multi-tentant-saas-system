import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  OrgId,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { PayrollCyclesService } from './payroll-cycles.service';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';

@ApiTags('Payroll Cycles')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'payroll-cycles', version: '1' })
export class PayrollCyclesController {
  constructor(private readonly payrollCyclesService: PayrollCyclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Payroll cycle created' })
  create(
    @OrgId() orgId: string,
    @Body() dto: CreatePayrollCycleDto,
  ) {
    return this.payrollCyclesService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List payroll cycles for organization' })
  findAll(@OrgId() orgId: string) {
    return this.payrollCyclesService.findAllByOrg(orgId);
  }
}
