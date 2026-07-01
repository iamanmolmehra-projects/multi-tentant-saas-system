import { ExpenseEntity } from '../../expenses/entities/expense.entity';
import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';
export declare class ApprovalEntity {
    id: string;
    orgId: string;
    expenseId: string | null;
    expense: ExpenseEntity | null;
    reportId: string | null;
    report: ExpenseReportEntity | null;
    approverId: string;
    level: number;
    status: string;
    comments: string | null;
    decidedAt: Date | null;
    createdAt: Date;
}
