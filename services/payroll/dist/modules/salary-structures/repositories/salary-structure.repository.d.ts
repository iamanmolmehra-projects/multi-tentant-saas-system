import { Repository } from 'typeorm';
import { SalaryStructureEntity } from '../entities/salary-structure.entity';
export declare class SalaryStructureRepository {
    private readonly repo;
    constructor(repo: Repository<SalaryStructureEntity>);
    create(data: Partial<SalaryStructureEntity>): Promise<SalaryStructureEntity>;
    findCurrentByUser(orgId: string, userId: string): Promise<SalaryStructureEntity | null>;
    findHistoryByUser(orgId: string, userId: string): Promise<SalaryStructureEntity[]>;
    findAllCurrentByOrg(orgId: string): Promise<SalaryStructureEntity[]>;
    markPreviousAsInactive(orgId: string, userId: string, effectiveTo: Date): Promise<void>;
    findById(id: string, orgId: string): Promise<SalaryStructureEntity | null>;
}
