import { IAuthenticatedUser } from '@multi-tenant/shared';
import { PayrollRunsService } from './payroll-runs.service';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';
export declare class PayrollRunsController {
    private readonly payrollRunsService;
    constructor(payrollRunsService: PayrollRunsService);
    trigger(orgId: string, user: IAuthenticatedUser, dto: TriggerPayrollRunDto): Promise<import("./entities/payroll-run.entity").PayrollRunEntity>;
    findAll(orgId: string): Promise<import("./entities/payroll-run.entity").PayrollRunEntity[]>;
    findOne(id: string, orgId: string): Promise<import("./entities/payroll-run.entity").PayrollRunEntity>;
    cancel(id: string, orgId: string, user: IAuthenticatedUser): Promise<import("./entities/payroll-run.entity").PayrollRunEntity>;
}
