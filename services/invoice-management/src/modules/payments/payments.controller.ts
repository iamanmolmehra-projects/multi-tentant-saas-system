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
  RequirePermissions,
  PermissionEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiCreatedResponse({ description: 'Payment recorded' })
  recordPayment(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.paymentsService.recordPayment(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiOkResponse({ description: 'List payments for an invoice' })
  findByInvoice(
    @OrgId() orgId: string,
    @Query('invoiceId') invoiceId: string,
  ) {
    return this.paymentsService.findByInvoice(orgId, invoiceId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get payment by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.paymentsService.findById(id, orgId);
  }
}
