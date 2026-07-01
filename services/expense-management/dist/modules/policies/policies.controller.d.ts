import { PoliciesService } from './policies.service';
declare class CreatePolicyDto {
    name: string;
    categoryId?: string;
    roleId?: string;
    maxAmount?: number;
    currency?: string;
    period?: string;
    requiresReceiptAbove?: number;
    autoApproveBelow?: number;
    isActive?: boolean;
}
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    create(orgId: string, dto: CreatePolicyDto): Promise<import("./entities/policy.entity").PolicyEntity>;
    findAll(orgId: string): Promise<import("./entities/policy.entity").PolicyEntity[]>;
    findOne(id: string, orgId: string): Promise<import("./entities/policy.entity").PolicyEntity>;
    update(id: string, orgId: string, dto: Partial<CreatePolicyDto>): Promise<import("./entities/policy.entity").PolicyEntity>;
    delete(id: string, orgId: string): Promise<void>;
}
export {};
