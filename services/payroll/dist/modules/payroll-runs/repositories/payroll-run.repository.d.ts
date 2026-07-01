import { DataSource, Repository } from 'typeorm';
import { PayrollRunEntity } from '../entities/payroll-run.entity';
export declare class PayrollRunRepository {
    private readonly repo;
    private readonly dataSource;
    constructor(repo: Repository<PayrollRunEntity>, dataSource: DataSource);
    create(data: Partial<PayrollRunEntity>): Promise<PayrollRunEntity>;
    findById(id: string, orgId: string): Promise<PayrollRunEntity | null>;
    findByIdempotencyKey(key: string): Promise<PayrollRunEntity | null>;
    findAllByOrg(orgId: string): Promise<PayrollRunEntity[]>;
    acquireLock(lockKey: string, runId: string): Promise<boolean>;
    releaseLock(runId: string): Promise<void>;
    update(id: string, orgId: string, data: Partial<PayrollRunEntity>): Promise<PayrollRunEntity | null>;
    updateStatus(id: string, status: string, additionalData?: Partial<PayrollRunEntity>): Promise<void>;
}
