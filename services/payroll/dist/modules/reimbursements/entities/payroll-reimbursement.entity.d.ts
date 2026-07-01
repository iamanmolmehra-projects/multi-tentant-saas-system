import { PayrollRunEntity } from '../../payroll-runs/entities/payroll-run.entity';
export declare class PayrollReimbursementEntity {
    id: string;
    orgId: string;
    userId: string;
    expenseReportId: string;
    amount: number;
    currency: string;
    status: string;
    includedInRunId: string | null;
    includedInRun: PayrollRunEntity | null;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
}
