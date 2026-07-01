import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthenticatedUser, TenantIsolationGuard } from '@multi-tenant/shared';
import { InAppService } from './in-app.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(TenantIsolationGuard)
@Controller({ path: 'notifications', version: '1' })
export class InAppController {
  constructor(private readonly inAppService: InAppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List in-app notifications' })
  findAll(@CurrentUser() user: IAuthenticatedUser, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.inAppService.findByUser(user.userId, user.orgId, +page, +limit);
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  getUnreadCount(@CurrentUser() user: IAuthenticatedUser) {
    return this.inAppService.getUnreadCount(user.userId, user.orgId);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markAsRead(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: IAuthenticatedUser) {
    return this.inAppService.markAsRead(id, user.userId);
  }

  @Post('mark-all-read')
  @HttpCode(HttpStatus.OK)
  markAllRead(@CurrentUser() user: IAuthenticatedUser) {
    return this.inAppService.markAllRead(user.userId, user.orgId);
  }
}
