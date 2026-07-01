import { IPaginatedResult } from '@multi-tenant/shared';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseRepository } from './repositories/expense.repository';
import { PoliciesService } from '../policies/policies.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
export declare class ExpensesService {
    private readonly expenseRepository;
    private readonly policiesService;
    constructor(expenseRepository: ExpenseRepository, policiesService: PoliciesService);
    create(orgId: string, userId: string, roleId: string, dto: CreateExpenseDto): Promise<ExpenseEntity>;
    findAll(orgId: string, userId: string, query: QueryExpensesDto): Promise<IPaginatedResult<ExpenseEntity>>;
    findAllForOrg(orgId: string, query: QueryExpensesDto): Promise<IPaginatedResult<ExpenseEntity>>;
    findById(id: string, orgId: string): Promise<ExpenseEntity>;
    update(id: string, orgId: string, userId: string, dto: UpdateExpenseDto): Promise<ExpenseEntity>;
    delete(id: string, orgId: string, userId: string): Promise<void>;
    findByReportId(reportId: string, orgId: string): Promise<ExpenseEntity[]>;
}
