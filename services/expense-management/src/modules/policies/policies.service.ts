import { Injectable, NotFoundException } from '@nestjs/common';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyRepository } from './repositories/policy.repository';

interface PolicyValidationInput {
  amount: number;
  categoryId: string | null;
  roleId: string;
  userId: string;
  expenseDate: Date;
  receiptUrl: string | null;
}

/**
 * Strategy pattern for expense policy validation.
 * Each policy type has its own validation logic.
 */
@Injectable()
export class PoliciesService {
  constructor(
    private readonly policyRepository: PolicyRepository,
  ) {}

  async create(orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity> {
    return this.policyRepository.create({ ...data, orgId });
  }

  async findAll(orgId: string): Promise<PolicyEntity[]> {
    return this.policyRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<PolicyEntity> {
    const policy = await this.policyRepository.findById(id, orgId);
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }
    return policy;
  }

  async update(id: string, orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity> {
    const updated = await this.policyRepository.update(id, orgId, data);
    if (!updated) {
      throw new NotFoundException('Policy not found');
    }
    return updated;
  }

  async delete(id: string, orgId: string): Promise<void> {
    const success = await this.policyRepository.delete(id, orgId);
    if (!success) {
      throw new NotFoundException('Policy not found');
    }
  }

  /**
   * Validates an expense against all applicable policies.
   * Returns a violation message if any policy is violated, or null if valid.
   *
   * Strategy:
   * 1. MaxAmount - checks single expense amount limit
   * 2. ReceiptRequired - checks if receipt is needed above threshold
   * 3. AutoApprove - marks for auto-approval below threshold (informational, not a violation)
   */
  async validateExpense(
    orgId: string,
    input: PolicyValidationInput,
  ): Promise<string | null> {
    const policies = await this.policyRepository.findApplicablePolicies(
      orgId,
      input.categoryId,
      input.roleId,
    );

    const violations: string[] = [];

    for (const policy of policies) {
      const violation = this.applyPolicy(policy, input);
      if (violation) {
        violations.push(violation);
      }
    }

    return violations.length > 0 ? violations.join('; ') : null;
  }

  /**
   * Checks if an expense qualifies for auto-approval based on policies.
   */
  async canAutoApprove(
    orgId: string,
    amount: number,
    categoryId: string | null,
    roleId: string,
  ): Promise<boolean> {
    const policies = await this.policyRepository.findApplicablePolicies(
      orgId,
      categoryId,
      roleId,
    );

    for (const policy of policies) {
      if (policy.autoApproveBelow !== null && amount < Number(policy.autoApproveBelow)) {
        return true;
      }
    }

    return false;
  }

  private applyPolicy(policy: PolicyEntity, input: PolicyValidationInput): string | null {
    // Strategy 1: Max amount check
    if (policy.maxAmount !== null && input.amount > Number(policy.maxAmount)) {
      return `Exceeds max amount of ${policy.currency} ${policy.maxAmount} (Policy: ${policy.name})`;
    }

    // Strategy 2: Receipt required check
    if (
      policy.requiresReceiptAbove !== null &&
      input.amount > Number(policy.requiresReceiptAbove) &&
      !input.receiptUrl
    ) {
      return `Receipt required for expenses above ${policy.currency} ${policy.requiresReceiptAbove} (Policy: ${policy.name})`;
    }

    return null;
  }
}
