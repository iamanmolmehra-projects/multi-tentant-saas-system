import { Repository } from 'typeorm';
import { ReimbursementEntity } from './entities/reimbursement.entity';
export declare class ReimbursementsService {
    private readonly reimbursementRepo;
    constructor(reimbursementRepo: Repository<ReimbursementEntity>);
    createReimbursement(data: {
        orgId: string;
        reportId: string;
        userId: string;
        amount: number;
        currency: string;
    }): Promise<ReimbursementEntity>;
    findByReportId(reportId: string, orgId: string): Promise<ReimbursementEntity | null>;
    findAllByUser(orgId: string, userId: string): Promise<ReimbursementEntity[]>;
    findAllByOrg(orgId: string, status?: string): Promise<ReimbursementEntity[]>;
    markAsProcessing(id: string, orgId: string, payrollRef: string): Promise<ReimbursementEntity>;
    markAsCompleted(id: string, orgId: string): Promise<ReimbursementEntity>;
    markAsFailed(id: string, orgId: string): Promise<ReimbursementEntity>;
}
