import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';
export declare class ReimbursementEntity {
    id: string;
    orgId: string;
    reportId: string;
    report: ExpenseReportEntity;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    payrollRef: string | null;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
