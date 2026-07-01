import { SalaryStructuresService } from './salary-structures.service';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';
export declare class SalaryStructuresController {
    private readonly salaryStructuresService;
    constructor(salaryStructuresService: SalaryStructuresService);
    create(orgId: string, dto: CreateSalaryStructureDto): Promise<import("./entities/salary-structure.entity").SalaryStructureEntity>;
    findCurrentByUser(userId: string, orgId: string): Promise<import("./entities/salary-structure.entity").SalaryStructureEntity>;
    findHistoryByUser(userId: string, orgId: string): Promise<import("./entities/salary-structure.entity").SalaryStructureEntity[]>;
}
