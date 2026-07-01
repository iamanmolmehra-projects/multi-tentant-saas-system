import { Repository } from 'typeorm';
import { PayslipEntity } from '../entities/payslip.entity';
export declare class PayslipRepository {
    private readonly repo;
    constructor(repo: Repository<PayslipEntity>);
    create(data: Partial<PayslipEntity>): Promise<PayslipEntity>;
    findById(id: string, orgId: string): Promise<PayslipEntity | null>;
    findByUser(orgId: string, userId: string, options?: {
        page?: number;
        limit?: number;
    }): Promise<[PayslipEntity[], number]>;
    findByRunId(runId: string, orgId: string): Promise<PayslipEntity[]>;
    getYtdTotals(orgId: string, userId: string, financialYearStart: Date, beforeDate: Date): Promise<{
        ytdGross: number;
        ytdTax: number;
    }>;
}
