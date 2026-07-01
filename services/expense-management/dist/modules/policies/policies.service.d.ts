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
export declare class PoliciesService {
    private readonly policyRepository;
    constructor(policyRepository: PolicyRepository);
    create(orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity>;
    findAll(orgId: string): Promise<PolicyEntity[]>;
    findById(id: string, orgId: string): Promise<PolicyEntity>;
    update(id: string, orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity>;
    delete(id: string, orgId: string): Promise<void>;
    validateExpense(orgId: string, input: PolicyValidationInput): Promise<string | null>;
    canAutoApprove(orgId: string, amount: number, categoryId: string | null, roleId: string): Promise<boolean>;
    private applyPolicy;
}
export {};
