import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
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
import { PayslipsService } from './payslips.service';

@ApiTags('Payslips')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'payslips', version: '1' })
export class PayslipsController {
  constructor(private readonly payslipsService: PayslipsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List payslips for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.payslipsService.findByUser(orgId, user.userId, page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get payslip by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.payslipsService.findById(id, orgId);
  }

  @Get(':id/pdf')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get payslip PDF URL' })
  getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.payslipsService.getPdfUrl(id, orgId);
  }
}
