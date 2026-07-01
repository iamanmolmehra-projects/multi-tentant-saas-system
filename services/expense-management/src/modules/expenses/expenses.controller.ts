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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'expenses', version: '1' })
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PermissionEnum.EXPENSE_CREATE)
  @ApiCreatedResponse({ description: 'Expense created' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(orgId, user.userId, user.roleId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiOkResponse({ description: 'List expenses for current user' })
  findAll(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Query() query: QueryExpensesDto,
  ) {
    return this.expensesService.findAll(orgId, user.userId, query);
  }

  @Get('org')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_APPROVE)
  @ApiOkResponse({ description: 'List all expenses in the organization (manager/admin)' })
  findAllForOrg(
    @OrgId() orgId: string,
    @Query() query: QueryExpensesDto,
  ) {
    return this.expensesService.findAllForOrg(orgId, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get expense by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.expensesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Expense updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, orgId, user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PermissionEnum.EXPENSE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Expense deleted' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.expensesService.delete(id, orgId, user.userId);
  }
}
