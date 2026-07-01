import { Repository } from 'typeorm';
import { ExpenseEntity } from '../entities/expense.entity';
export declare class ExpenseRepository {
    private readonly repo;
    constructor(repo: Repository<ExpenseEntity>);
    create(data: Partial<ExpenseEntity>): Promise<ExpenseEntity>;
    findById(id: string, orgId: string): Promise<ExpenseEntity | null>;
    findByIdempotencyKey(key: string): Promise<ExpenseEntity | null>;
    findAllByOrg(orgId: string, options: {
        page: number;
        limit: number;
        status?: string;
        categoryId?: string;
        reportId?: string;
        userId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<[ExpenseEntity[], number]>;
    sumByUserAndPeriod(orgId: string, userId: string, categoryId: string | null, fromDate: Date, toDate: Date): Promise<number>;
    update(id: string, orgId: string, data: Partial<ExpenseEntity>): Promise<ExpenseEntity | null>;
    softDelete(id: string, orgId: string): Promise<boolean>;
    findByReportId(reportId: string, orgId: string): Promise<ExpenseEntity[]>;
}
