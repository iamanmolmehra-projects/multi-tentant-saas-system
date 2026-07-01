import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  ApproverResolutionStrategy,
  ApproverResolutionConfig,
} from '../interfaces/approver-resolution-strategy.interface';

/**
 * Resolves the approver by finding a user with the specified role in the organization.
 * Calls the User Management Service to find users matching the role.
 */
@Injectable()
export class ByRoleStrategy implements ApproverResolutionStrategy {
  private readonly logger = new Logger(ByRoleStrategy.name);
  private readonly usersServiceUrl: string;
  private readonly serviceApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL', 'http://localhost:3001');
    this.serviceApiKey = this.configService.get<string>('INTERNAL_SERVICE_API_KEY', '');
  }

  /**
   * Resolve approver by querying the User Management service for users
   * with the specified role within the organization.
   */
  async resolve(orgId: string, userId: string, config: ApproverResolutionConfig): Promise<string> {
    const role = config.approverRole;
    if (!role) {
      throw new Error('approverRole is required for role-based resolution');
    }

    try {
      const response = await axios.get(
        `${this.usersServiceUrl}/api/v1/users`,
        {
          params: { roleName: role, limit: 1 },
          headers: {
            'x-service-api-key': this.serviceApiKey,
            'x-org-id': orgId,
          },
          timeout: 5000,
        },
      );

      const users = response.data?.data || response.data;
      if (!users || users.length === 0) {
        this.logger.warn(`No user found with role '${role}' in org ${orgId}`);
        throw new Error(`No user found with role '${role}' in org ${orgId}`);
      }

      return users[0].id;
    } catch (error) {
      this.logger.error(`Failed to resolve role-based approver for role '${role}': ${error.message}`);
      throw error;
    }
  }
}
