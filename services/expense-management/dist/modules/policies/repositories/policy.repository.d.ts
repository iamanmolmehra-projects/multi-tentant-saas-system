import { Repository } from 'typeorm';
import { PolicyEntity } from '../entities/policy.entity';
export declare class PolicyRepository {
    private readonly repo;
    constructor(repo: Repository<PolicyEntity>);
    create(data: Partial<PolicyEntity>): Promise<PolicyEntity>;
    findById(id: string, orgId: string): Promise<PolicyEntity | null>;
    findAllByOrg(orgId: string, activeOnly?: boolean): Promise<PolicyEntity[]>;
    findApplicablePolicies(orgId: string, categoryId: string | null, roleId: string | null): Promise<PolicyEntity[]>;
    update(id: string, orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity | null>;
    delete(id: string, orgId: string): Promise<boolean>;
}
