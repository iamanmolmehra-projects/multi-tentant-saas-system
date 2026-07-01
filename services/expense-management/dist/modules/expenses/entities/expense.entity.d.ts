import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
export declare class ExpenseEntity {
    id: string;
    orgId: string;
    userId: string;
    reportId: string | null;
    report: ExpenseReportEntity | null;
    categoryId: string | null;
    category: CategoryEntity | null;
    title: string;
    description: string | null;
    amount: number;
    currency: string;
    expenseDate: Date;
    merchantName: string | null;
    receiptUrl: string | null;
    receiptMetadata: Record<string, unknown> | null;
    status: string;
    policyViolation: string | null;
    idempotencyKey: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
