export declare class UpdateExpenseDto {
    title?: string;
    description?: string;
    amount?: number;
    currency?: string;
    expenseDate?: string;
    categoryId?: string;
    reportId?: string;
    merchantName?: string;
    receiptUrl?: string;
    receiptMetadata?: Record<string, unknown>;
}
