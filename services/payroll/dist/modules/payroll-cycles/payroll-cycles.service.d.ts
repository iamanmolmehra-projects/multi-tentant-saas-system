import { PayrollCycleEntity } from './entities/payroll-cycle.entity';
import { PayrollCycleRepository } from './repositories/payroll-cycle.repository';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';
export declare class PayrollCyclesService {
    private readonly payrollCycleRepository;
    constructor(payrollCycleRepository: PayrollCycleRepository);
    create(orgId: string, dto: CreatePayrollCycleDto): Promise<PayrollCycleEntity>;
    findAllByOrg(orgId: string): Promise<PayrollCycleEntity[]>;
    findById(id: string, orgId: string): Promise<PayrollCycleEntity>;
}
