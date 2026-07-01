import { IAuthenticatedUser } from '@multi-tenant/shared';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(orgId: string, user: IAuthenticatedUser, dto: CreateExpenseDto): Promise<import("./entities/expense.entity").ExpenseEntity>;
    findAll(orgId: string, user: IAuthenticatedUser, query: QueryExpensesDto): Promise<import("@multi-tenant/shared").IPaginatedResult<import("./entities/expense.entity").ExpenseEntity>>;
    findAllForOrg(orgId: string, query: QueryExpensesDto): Promise<import("@multi-tenant/shared").IPaginatedResult<import("./entities/expense.entity").ExpenseEntity>>;
    findOne(id: string, orgId: string): Promise<import("./entities/expense.entity").ExpenseEntity>;
    update(id: string, orgId: string, user: IAuthenticatedUser, dto: UpdateExpenseDto): Promise<import("./entities/expense.entity").ExpenseEntity>;
    delete(id: string, orgId: string, user: IAuthenticatedUser): Promise<void>;
}
