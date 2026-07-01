import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  OrgId,
  CurrentUser,
  IAuthenticatedUser,
  TenantIsolationGuard,
  RolesGuard,
  PermissionsGuard,
} from '@multi-tenant/shared';
import { InstancesService } from './instances.service';
import { CreateInstanceDto } from './dto/create-instance.dto';

@ApiTags('Workflow Instances')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'instances', version: '1' })
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Workflow instance created (idempotent on trigger entity)' })
  create(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateInstanceDto,
  ) {
    return this.instancesService.create(orgId, user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List all workflow instances for the organization' })
  findAll(@OrgId() orgId: string) {
    return this.instancesService.findAll(orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get workflow instance by ID with steps' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.instancesService.findById(id, orgId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Cancel a workflow instance' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.instancesService.cancel(id, orgId, user.userId);
  }
}
