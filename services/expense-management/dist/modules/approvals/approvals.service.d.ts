import { Repository } from 'typeorm';
import { ApprovalEntity } from './entities/approval.entity';
export declare class ApprovalsService {
    private readonly approvalRepo;
    constructor(approvalRepo: Repository<ApprovalEntity>);
    createApproval(data: {
        orgId: string;
        expenseId?: string;
        reportId?: string;
        approverId: string;
        level: number;
    }): Promise<ApprovalEntity>;
    approve(id: string, orgId: string, approverId: string, comments?: string): Promise<ApprovalEntity>;
    reject(id: string, orgId: string, approverId: string, comments?: string): Promise<ApprovalEntity>;
    findPendingByApprover(orgId: string, approverId: string): Promise<ApprovalEntity[]>;
    findByReportId(reportId: string, orgId: string): Promise<ApprovalEntity[]>;
    findByExpenseId(expenseId: string, orgId: string): Promise<ApprovalEntity[]>;
}
