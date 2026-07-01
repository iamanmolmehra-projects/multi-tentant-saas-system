import { Injectable } from '@nestjs/common';
import {
  ApproverResolutionStrategy,
  ApproverResolutionConfig,
} from '../interfaces/approver-resolution-strategy.interface';

/**
 * Resolves the approver by returning the specifically configured user UUID.
 * This is the simplest strategy - it just returns the pre-configured approver value.
 */
@Injectable()
export class BySpecificUserStrategy implements ApproverResolutionStrategy {
  /**
   * Resolve approver by returning the configured specific user ID directly.
   */
  async resolve(orgId: string, userId: string, config: ApproverResolutionConfig): Promise<string> {
    const approverValue = config.approverValue;
    if (!approverValue) {
      throw new Error('approverValue (user UUID) is required for specific_user resolution');
    }

    return approverValue;
  }
}
