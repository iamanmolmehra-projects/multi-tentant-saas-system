import { PayrollRunEntity } from '../../payroll-runs/entities/payroll-run.entity';
export declare class PayslipEntity {
    id: string;
    orgId: string;
    userId: string;
    runId: string;
    run: PayrollRunEntity;
    periodStart: Date;
    periodEnd: Date;
    grossSalary: number;
    netSalary: number;
    components: Record<string, number>;
    deductions: Record<string, number>;
    reimbursements: number;
    ytdGross: number;
    ytdTax: number;
    pdfUrl: string | null;
    createdAt: Date;
}
