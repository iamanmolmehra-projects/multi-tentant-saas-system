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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'customers', version: '1' })
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_CREATE)
  @ApiCreatedResponse({ description: 'Customer created' })
  create(
    @OrgId() orgId: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiOkResponse({ description: 'List customers for the organization' })
  findAll(
    @OrgId() orgId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll(orgId, { page, limit, search });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get customer by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.customersService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Customer updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PermissionEnum.INVOICE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Customer deactivated' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.customersService.softDelete(id, orgId);
  }
}
