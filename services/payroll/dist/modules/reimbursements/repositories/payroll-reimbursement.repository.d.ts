import { Repository } from 'typeorm';
import { PayrollReimbursementEntity } from '../entities/payroll-reimbursement.entity';
export declare class PayrollReimbursementRepository {
    private readonly repo;
    constructor(repo: Repository<PayrollReimbursementEntity>);
    create(data: Partial<PayrollReimbursementEntity>): Promise<PayrollReimbursementEntity>;
    findByEventId(eventId: string): Promise<PayrollReimbursementEntity | null>;
    findPendingByUser(orgId: string, userId: string): Promise<PayrollReimbursementEntity[]>;
    sumPendingByUser(orgId: string, userId: string): Promise<number>;
    markAsIncluded(orgId: string, userId: string, runId: string): Promise<void>;
    findByRunId(runId: string): Promise<PayrollReimbursementEntity[]>;
}
