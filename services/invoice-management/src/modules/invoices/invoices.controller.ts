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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'invoices', version: '1' })
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_CREATE)
  @ApiCreatedResponse({ description: 'Invoice created' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(orgId, user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiOkResponse({ description: 'List invoices for the organization' })
  findAll(
    @OrgId() orgId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.invoicesService.findAll(orgId, {
      page,
      limit,
      status,
      customerId,
      fromDate,
      toDate,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get invoice by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.invoicesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Invoice updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, orgId, dto);
  }

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Invoice sent and number assigned' })
  send(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.invoicesService.send(id, orgId);
  }

  @Post(':id/void')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Invoice voided' })
  void(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.invoicesService.void(id, orgId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PermissionEnum.INVOICE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Invoice deleted' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.invoicesService.delete(id, orgId);
  }
}
