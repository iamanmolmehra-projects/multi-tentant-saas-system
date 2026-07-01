import { PayrollReimbursementEntity } from './entities/payroll-reimbursement.entity';
import { PayrollReimbursementRepository } from './repositories/payroll-reimbursement.repository';
export interface ReimbursementApprovedEvent {
    eventId: string;
    orgId: string;
    userId: string;
    expenseReportId: string;
    amount: number;
    currency: string;
}
export declare class ReimbursementsService {
    private readonly reimbursementRepository;
    private readonly logger;
    constructor(reimbursementRepository: PayrollReimbursementRepository);
    handleReimbursementApproved(event: ReimbursementApprovedEvent): Promise<PayrollReimbursementEntity>;
    getPendingTotal(orgId: string, userId: string): Promise<number>;
    markAsIncluded(orgId: string, userId: string, runId: string): Promise<void>;
    findByRunId(runId: string): Promise<PayrollReimbursementEntity[]>;
}
