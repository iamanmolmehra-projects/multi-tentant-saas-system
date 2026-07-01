/**
 * Strategy interface for resolving approvers in workflow steps.
 * Each implementation provides a different resolution mechanism.
 */
export interface ApproverResolutionStrategy {
  /**
   * Resolve an approver based on organization context, user context, and configuration.
   *
   * @param orgId - Organization ID for tenant-scoped resolution
   * @param userId - The user for whom the approver is being resolved (e.g., the requester)
   * @param config - Strategy-specific configuration
   * @returns UUID of the resolved approver
   */
  resolve(orgId: string, userId: string, config: ApproverResolutionConfig): Promise<string>;
}

/**
 * Configuration passed to approver resolution strategies.
 */
export interface ApproverResolutionConfig {
  /** Type of resolution: 'hierarchy', 'role', 'specific_user' */
  approverType: string;

  /** Specific value (e.g., user UUID for specific_user strategy) */
  approverValue?: string;

  /** Role name for role-based resolution */
  approverRole?: string;
}
