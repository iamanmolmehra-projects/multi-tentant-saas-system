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
import { RecurringService } from './recurring.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

@ApiTags('Recurring Invoices')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'recurring-invoices', version: '1' })
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_CREATE)
  @ApiCreatedResponse({ description: 'Recurring invoice template created' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateRecurringDto,
  ) {
    return this.recurringService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiOkResponse({ description: 'List recurring invoice templates' })
  findAll(@OrgId() orgId: string) {
    return this.recurringService.findAll(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get recurring invoice template by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.recurringService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Recurring invoice template updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(id, orgId, dto);
  }

  @Post(':id/generate')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_CREATE)
  @ApiParam({ name: 'id', type: String })
  @ApiCreatedResponse({ description: 'Invoice generated from recurring template' })
  generate(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.recurringService.generateFromTemplate(id, orgId, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PermissionEnum.INVOICE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Recurring invoice template deactivated' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.recurringService.deactivate(id, orgId);
  }
}
