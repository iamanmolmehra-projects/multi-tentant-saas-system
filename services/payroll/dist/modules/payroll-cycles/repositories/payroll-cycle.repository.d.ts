import { Repository } from 'typeorm';
import { PayrollCycleEntity } from '../entities/payroll-cycle.entity';
export declare class PayrollCycleRepository {
    private readonly repo;
    constructor(repo: Repository<PayrollCycleEntity>);
    create(data: Partial<PayrollCycleEntity>): Promise<PayrollCycleEntity>;
    findAllByOrg(orgId: string): Promise<PayrollCycleEntity[]>;
    findById(id: string, orgId: string): Promise<PayrollCycleEntity | null>;
    findActiveByOrg(orgId: string): Promise<PayrollCycleEntity[]>;
}
