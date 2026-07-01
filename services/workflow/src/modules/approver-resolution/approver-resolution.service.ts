import { Injectable } from '@nestjs/common';
import { ApproverResolutionFactory } from './approver-resolution.factory';
import { ApproverResolutionConfig } from './interfaces/approver-resolution-strategy.interface';

@Injectable()
export class ApproverResolutionService {
  constructor(private readonly factory: ApproverResolutionFactory) {}

  /**
   * Resolve an approver based on the configured strategy.
   * Delegates to the appropriate strategy implementation selected by the factory.
   *
   * @param orgId - Organization ID for tenant-scoped resolution
   * @param userId - User who initiated the workflow (used for hierarchy resolution)
   * @param config - Configuration containing approver type, value, and role
   * @returns Resolved approver UUID
   */
  async resolve(orgId: string, userId: string, config: ApproverResolutionConfig): Promise<string> {
    const strategy = this.factory.getStrategy(config.approverType);
    return strategy.resolve(orgId, userId, config);
  }
}
