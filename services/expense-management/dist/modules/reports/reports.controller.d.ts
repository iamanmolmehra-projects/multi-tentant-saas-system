import { IAuthenticatedUser, PaginationQueryDto } from '@multi-tenant/shared';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
declare class QueryReportsDto extends PaginationQueryDto {
    status?: string;
}
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(orgId: string, user: IAuthenticatedUser, dto: CreateReportDto): Promise<import("./entities/expense-report.entity").ExpenseReportEntity>;
    findAll(orgId: string, user: IAuthenticatedUser, query: QueryReportsDto): Promise<import("@multi-tenant/shared").IPaginatedResult<import("./entities/expense-report.entity").ExpenseReportEntity>>;
    findAllForOrg(orgId: string, query: QueryReportsDto): Promise<import("@multi-tenant/shared").IPaginatedResult<import("./entities/expense-report.entity").ExpenseReportEntity>>;
    findOne(id: string, orgId: string): Promise<import("./entities/expense-report.entity").ExpenseReportEntity>;
    submit(id: string, orgId: string, user: IAuthenticatedUser): Promise<import("./entities/expense-report.entity").ExpenseReportEntity>;
    approve(id: string, orgId: string, user: IAuthenticatedUser): Promise<import("./entities/expense-report.entity").ExpenseReportEntity>;
    reject(id: string, orgId: string, user: IAuthenticatedUser): Promise<import("./entities/expense-report.entity").ExpenseReportEntity>;
    delete(id: string, orgId: string, user: IAuthenticatedUser): Promise<void>;
}
export {};
