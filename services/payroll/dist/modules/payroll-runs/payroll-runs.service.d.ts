import { PayrollRunEntity } from './entities/payroll-run.entity';
import { PayrollRunRepository } from './repositories/payroll-run.repository';
import { SalaryStructuresService } from '../salary-structures/salary-structures.service';
import { PayrollCyclesService } from '../payroll-cycles/payroll-cycles.service';
import { TaxService } from '../tax/tax.service';
import { PayslipsService } from '../payslips/payslips.service';
import { ReimbursementsService } from '../reimbursements/reimbursements.service';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';
export declare class PayrollRunsService {
    private readonly payrollRunRepository;
    private readonly salaryStructuresService;
    private readonly payrollCyclesService;
    private readonly taxService;
    private readonly payslipsService;
    private readonly reimbursementsService;
    private readonly logger;
    constructor(payrollRunRepository: PayrollRunRepository, salaryStructuresService: SalaryStructuresService, payrollCyclesService: PayrollCyclesService, taxService: TaxService, payslipsService: PayslipsService, reimbursementsService: ReimbursementsService);
    trigger(orgId: string, processedBy: string, dto: TriggerPayrollRunDto): Promise<PayrollRunEntity>;
    findAllByOrg(orgId: string): Promise<PayrollRunEntity[]>;
    findById(id: string, orgId: string): Promise<PayrollRunEntity>;
    cancel(id: string, orgId: string, userId: string): Promise<PayrollRunEntity>;
}
