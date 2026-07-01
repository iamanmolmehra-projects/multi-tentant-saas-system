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
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  IAuthenticatedUser,
  OrgId,
  RequirePermissions,
  RequireRoles,
  PermissionEnum,
  RoleEnum,
} from '@multi-tenant/shared';
import { RolesGuard } from '@multi-tenant/shared';
import { PermissionsGuard } from '@multi-tenant/shared';
import { TenantIsolationGuard } from '@multi-tenant/shared';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.USERS_CREATE)
  @ApiCreatedResponse({ description: 'User created' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(orgId, dto, user.userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.USERS_LIST)
  @ApiOkResponse({ description: 'List users in org' })
  findAll(@OrgId() orgId: string, @Query() query: QueryUsersDto) {
    return this.usersService.findAll(orgId, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.USERS_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get user by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.usersService.findById(id, orgId);
  }

  @Get(':id/subordinates')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PermissionEnum.USERS_READ)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get subordinates of a user' })
  getSubordinates(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
  ) {
    return this.usersService.getSubordinates(id, orgId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  @RequirePermissions(PermissionEnum.USERS_UPDATE)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'User updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, orgId, dto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireRoles(RoleEnum.ORG_ADMIN, RoleEnum.SUPER_ADMIN)
  @RequirePermissions(PermissionEnum.USERS_DELETE)
  @ApiParam({ name: 'id', type: String })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.usersService.deactivate(id, orgId, user.userId);
  }
}
