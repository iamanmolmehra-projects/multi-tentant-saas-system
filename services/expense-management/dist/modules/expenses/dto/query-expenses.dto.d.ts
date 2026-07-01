import { PaginationQueryDto } from '@multi-tenant/shared';
export declare class QueryExpensesDto extends PaginationQueryDto {
    status?: string;
    categoryId?: string;
    reportId?: string;
    fromDate?: string;
    toDate?: string;
}
