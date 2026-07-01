import { ExpenseEntity } from '../../expenses/entities/expense.entity';
export declare class ExpenseReportEntity {
    id: string;
    orgId: string;
    userId: string;
    title: string;
    status: string;
    totalAmount: number;
    currency: string;
    submittedAt: Date | null;
    approvedAt: Date | null;
    approvedBy: string | null;
    version: number;
    expenses: ExpenseEntity[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
