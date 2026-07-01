import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  ApproverResolutionStrategy,
  ApproverResolutionConfig,
} from '../interfaces/approver-resolution-strategy.interface';

/**
 * Resolves the approver by navigating up the user's reporting hierarchy.
 * Calls the User Management Service REST API to find the user's manager.
 */
@Injectable()
export class ByHierarchyStrategy implements ApproverResolutionStrategy {
  private readonly logger = new Logger(ByHierarchyStrategy.name);
  private readonly usersServiceUrl: string;
  private readonly serviceApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL', 'http://localhost:3001');
    this.serviceApiKey = this.configService.get<string>('INTERNAL_SERVICE_API_KEY', '');
  }

  /**
   * Resolve approver by calling the User Management service to get the
   * user's direct manager (goes up the hierarchy).
   */
  async resolve(orgId: string, userId: string, config: ApproverResolutionConfig): Promise<string> {
    try {
      const response = await axios.get(
        `${this.usersServiceUrl}/api/v1/users/${userId}/manager`,
        {
          headers: {
            'x-service-api-key': this.serviceApiKey,
            'x-org-id': orgId,
          },
          timeout: 5000,
        },
      );

      const managerId = response.data?.id || response.data?.managerId;
      if (!managerId) {
        this.logger.warn(`No manager found for user ${userId} in org ${orgId}`);
        throw new Error(`No manager found for user ${userId}`);
      }

      return managerId;
    } catch (error) {
      this.logger.error(`Failed to resolve hierarchy approver for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}
