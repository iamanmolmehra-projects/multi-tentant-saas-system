import { PayslipEntity } from './entities/payslip.entity';
import { PayslipRepository } from './repositories/payslip.repository';
export interface CreatePayslipData {
    orgId: string;
    userId: string;
    runId: string;
    periodStart: Date;
    periodEnd: Date;
    grossSalary: number;
    netSalary: number;
    components: Record<string, number>;
    deductions: Record<string, number>;
    reimbursements: number;
}
export declare class PayslipsService {
    private readonly payslipRepository;
    constructor(payslipRepository: PayslipRepository);
    create(data: CreatePayslipData): Promise<PayslipEntity>;
    findByUser(orgId: string, userId: string, page?: number, limit?: number): Promise<{
        data: PayslipEntity[];
        total: number;
    }>;
    findById(id: string, orgId: string): Promise<PayslipEntity>;
    getPdfUrl(id: string, orgId: string): Promise<string>;
    private getFinancialYearStart;
}
