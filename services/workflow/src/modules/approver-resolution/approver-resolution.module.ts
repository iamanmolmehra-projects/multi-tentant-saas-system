import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApproverResolutionService } from './approver-resolution.service';
import { ApproverResolutionFactory } from './approver-resolution.factory';
import { ByHierarchyStrategy } from './strategies/by-hierarchy.strategy';
import { ByRoleStrategy } from './strategies/by-role.strategy';
import { BySpecificUserStrategy } from './strategies/by-specific-user.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    ApproverResolutionService,
    ApproverResolutionFactory,
    ByHierarchyStrategy,
    ByRoleStrategy,
    BySpecificUserStrategy,
  ],
  exports: [ApproverResolutionService],
})
export class ApproverResolutionModule {}
