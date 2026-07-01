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
import { StepsService } from './steps.service';

@ApiTags('Workflow Steps')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard, RolesGuard, PermissionsGuard)
@Controller({ path: 'steps', version: '1' })
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List all pending steps for the current user' })
  findPending(
    @OrgId() orgId: string,
    @CurrentUser() user: IAuthenticatedUser,
  ) {
    return this.stepsService.findPendingForApprover(user.userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Step approved' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body('comments') comments?: string,
  ) {
    return this.stepsService.approve(id, user.userId, comments);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Step rejected' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: IAuthenticatedUser,
    @Body('comments') comments?: string,
  ) {
    return this.stepsService.reject(id, user.userId, comments);
  }
}
