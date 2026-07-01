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
  OrgId,
  RequirePermissions,
  RequireRoles,
  PermissionEnum,
  RoleEnum,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Expense Categories')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_CREATE)
  @ApiCreatedResponse({ description: 'Category created' })
  create(@OrgId() orgId: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(orgId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiOkResponse({ description: 'List all categories' })
  findAll(@OrgId() orgId: string) {
    return this.categoriesService.findAll(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.EXPENSE_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get category by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.categoriesService.findById(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Category updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: Partial<CreateCategoryDto>,
  ) {
    return this.categoriesService.update(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.EXPENSE_DELETE)
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'Category deleted' })
  delete(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.categoriesService.delete(id, orgId);
  }
}
