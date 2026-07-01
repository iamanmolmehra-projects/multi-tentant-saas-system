import { Injectable, BadRequestException } from '@nestjs/common';
import { ApproverResolutionStrategy } from './interfaces/approver-resolution-strategy.interface';
import { ByHierarchyStrategy } from './strategies/by-hierarchy.strategy';
import { ByRoleStrategy } from './strategies/by-role.strategy';
import { BySpecificUserStrategy } from './strategies/by-specific-user.strategy';

/**
 * Factory that selects the appropriate approver resolution strategy
 * based on the configured approver_type.
 *
 * Supported types:
 * - 'hierarchy' -> ByHierarchyStrategy
 * - 'role' -> ByRoleStrategy
 * - 'specific_user' -> BySpecificUserStrategy
 */
@Injectable()
export class ApproverResolutionFactory {
  private readonly strategies: Map<string, ApproverResolutionStrategy>;

  constructor(
    private readonly hierarchyStrategy: ByHierarchyStrategy,
    private readonly roleStrategy: ByRoleStrategy,
    private readonly specificUserStrategy: BySpecificUserStrategy,
  ) {
    this.strategies = new Map<string, ApproverResolutionStrategy>([
      ['hierarchy', this.hierarchyStrategy],
      ['role', this.roleStrategy],
      ['specific_user', this.specificUserStrategy],
    ]);
  }

  /**
   * Get the resolution strategy for the given approver type.
   * @throws BadRequestException if the approver type is not supported
   */
  getStrategy(approverType: string): ApproverResolutionStrategy {
    const strategy = this.strategies.get(approverType);

    if (!strategy) {
      throw new BadRequestException(
        `Unsupported approver type: '${approverType}'. Supported types: ${Array.from(this.strategies.keys()).join(', ')}`,
      );
    }

    return strategy;
  }
}
