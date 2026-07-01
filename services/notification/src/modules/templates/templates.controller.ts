import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequireRoles, RoleEnum, RolesGuard } from '@multi-tenant/shared';
import { TemplatesService } from './templates.service';

@ApiTags('Notification Templates')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ path: 'notification-templates', version: '1' })
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ORG_ADMIN)
  findAll() { return this.templatesService.findAll(); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  create(@Body() dto: any) { return this.templatesService.create(dto); }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: any) { return this.templatesService.update(id, dto); }
}
