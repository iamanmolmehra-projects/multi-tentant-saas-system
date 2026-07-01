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
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';

@ApiTags('Credit Notes')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'credit-notes', version: '1' })
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.INVOICE_CREATE)
  @ApiCreatedResponse({ description: 'Credit note issued' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateCreditNoteDto,
  ) {
    return this.creditNotesService.create(orgId, user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiOkResponse({ description: 'List credit notes for the organization' })
  findAll(
    @OrgId() orgId: string,
    @Query('invoiceId') invoiceId?: string,
  ) {
    return this.creditNotesService.findAll(orgId, invoiceId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.INVOICE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get credit note by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.creditNotesService.findById(id, orgId);
  }
}
