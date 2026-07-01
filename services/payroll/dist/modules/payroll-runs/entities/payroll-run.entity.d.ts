import { PayrollCycleEntity } from '../../payroll-cycles/entities/payroll-cycle.entity';
import { PayslipEntity } from '../../payslips/entities/payslip.entity';
export declare class PayrollRunEntity {
    id: string;
    orgId: string;
    cycleId: string;
    cycle: PayrollCycleEntity;
    periodStart: Date;
    periodEnd: Date;
    status: string;
    totalGross: number;
    totalNet: number;
    totalTax: number;
    employeeCount: number;
    processedBy: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    errorDetails: Record<string, unknown> | null;
    lockKey: string | null;
    idempotencyKey: string | null;
    payslips: PayslipEntity[];
    createdAt: Date;
    updatedAt: Date;
}
