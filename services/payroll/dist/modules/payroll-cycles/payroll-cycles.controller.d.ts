import { PayrollCyclesService } from './payroll-cycles.service';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';
export declare class PayrollCyclesController {
    private readonly payrollCyclesService;
    constructor(payrollCyclesService: PayrollCyclesService);
    create(orgId: string, dto: CreatePayrollCycleDto): Promise<import("./entities/payroll-cycle.entity").PayrollCycleEntity>;
    findAll(orgId: string): Promise<import("./entities/payroll-cycle.entity").PayrollCycleEntity[]>;
}
