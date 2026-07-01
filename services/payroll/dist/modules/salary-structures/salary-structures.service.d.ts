import { SalaryStructureEntity } from './entities/salary-structure.entity';
import { SalaryStructureRepository } from './repositories/salary-structure.repository';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';
export declare class SalaryStructuresService {
    private readonly salaryStructureRepository;
    constructor(salaryStructureRepository: SalaryStructureRepository);
    create(orgId: string, dto: CreateSalaryStructureDto): Promise<SalaryStructureEntity>;
    findCurrentByUser(orgId: string, userId: string): Promise<SalaryStructureEntity>;
    findHistoryByUser(orgId: string, userId: string): Promise<SalaryStructureEntity[]>;
    findAllCurrentByOrg(orgId: string): Promise<SalaryStructureEntity[]>;
}
