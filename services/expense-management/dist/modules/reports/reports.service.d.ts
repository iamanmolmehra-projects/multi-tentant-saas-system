import { IPaginatedResult, PaginationQueryDto } from '@multi-tenant/shared';
import { ExpenseReportEntity } from './entities/expense-report.entity';
import { ReportRepository } from './repositories/report.repository';
import { ExpenseRepository } from '../expenses/repositories/expense.repository';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly expenseRepository;
    constructor(reportRepository: ReportRepository, expenseRepository: ExpenseRepository);
    create(orgId: string, userId: string, dto: CreateReportDto): Promise<ExpenseReportEntity>;
    findAll(orgId: string, userId: string, query: PaginationQueryDto & {
        status?: string;
    }): Promise<IPaginatedResult<ExpenseReportEntity>>;
    findAllForOrg(orgId: string, query: PaginationQueryDto & {
        status?: string;
    }): Promise<IPaginatedResult<ExpenseReportEntity>>;
    findById(id: string, orgId: string): Promise<ExpenseReportEntity>;
    submit(id: string, orgId: string, userId: string): Promise<ExpenseReportEntity>;
    approve(id: string, orgId: string, approverId: string): Promise<ExpenseReportEntity>;
    reject(id: string, orgId: string, approverId: string): Promise<ExpenseReportEntity>;
    delete(id: string, orgId: string, userId: string): Promise<void>;
}
