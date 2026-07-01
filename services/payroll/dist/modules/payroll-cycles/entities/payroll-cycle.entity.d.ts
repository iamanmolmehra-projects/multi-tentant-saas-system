import { PayrollRunEntity } from '../../payroll-runs/entities/payroll-run.entity';
export declare class PayrollCycleEntity {
    id: string;
    orgId: string;
    name: string;
    frequency: string;
    payDay: number;
    startDate: Date;
    endDate: Date | null;
    isActive: boolean;
    runs: PayrollRunEntity[];
    createdAt: Date;
    updatedAt: Date;
}
