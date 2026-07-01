import {
  Body,
  Controller,
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
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  IAuthenticatedUser,
  OrgId,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { PayrollRunsService } from './payroll-runs.service';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';

@ApiTags('Payroll Runs')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'payroll-runs', version: '1' })
export class PayrollRunsController {
  constructor(private readonly payrollRunsService: PayrollRunsService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Payroll run triggered' })
  trigger(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: TriggerPayrollRunDto,
  ) {
    return this.payrollRunsService.trigger(orgId, user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List payroll runs for organization' })
  findAll(@OrgId() orgId: string) {
    return this.payrollRunsService.findAllByOrg(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get payroll run by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.payrollRunsService.findById(id, orgId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Payroll run cancelled' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.payrollRunsService.cancel(id, orgId, user.userId);
  }
}
