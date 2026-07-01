import { Repository } from 'typeorm';
import { ExpenseReportEntity } from '../entities/expense-report.entity';
export declare class ReportRepository {
    private readonly repo;
    constructor(repo: Repository<ExpenseReportEntity>);
    create(data: Partial<ExpenseReportEntity>): Promise<ExpenseReportEntity>;
    findById(id: string, orgId: string): Promise<ExpenseReportEntity | null>;
    findAllByOrg(orgId: string, options: {
        page: number;
        limit: number;
        status?: string;
        userId?: string;
    }): Promise<[ExpenseReportEntity[], number]>;
    updateWithLock(id: string, orgId: string, data: Partial<ExpenseReportEntity>, expectedVersion: number): Promise<ExpenseReportEntity | null>;
    softDelete(id: string, orgId: string): Promise<boolean>;
}
