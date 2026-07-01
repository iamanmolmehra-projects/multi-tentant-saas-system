import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { TaxService } from './tax.service';
import { CreateTaxDeclarationDto } from './dto/create-tax-declaration.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'tax', version: '1' })
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post('declarations')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Tax declaration created/updated' })
  createDeclaration(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateTaxDeclarationDto,
  ) {
    return this.taxService.createDeclaration(orgId, user.userId, dto);
  }

  @Get('declarations')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List tax declarations for current user' })
  findMyDeclarations(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.taxService.findDeclarationsByUser(orgId, user.userId);
  }

  @Get('declarations/:financialYear')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'financialYear', type: String, example: '2024-25' })
  @ApiOkResponse({ description: 'Get tax declaration for a financial year' })
  findDeclaration(
    @Param('financialYear') financialYear: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.taxService.findDeclaration(orgId, user.userId, financialYear);
  }
}
