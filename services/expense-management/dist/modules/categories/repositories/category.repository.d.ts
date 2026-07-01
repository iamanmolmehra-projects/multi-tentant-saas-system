import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
export declare class CategoryRepository {
    private readonly repo;
    constructor(repo: Repository<CategoryEntity>);
    create(data: Partial<CategoryEntity>): Promise<CategoryEntity>;
    findById(id: string, orgId: string): Promise<CategoryEntity | null>;
    findByCode(code: string, orgId: string): Promise<CategoryEntity | null>;
    findAllByOrg(orgId: string, includeInactive?: boolean): Promise<CategoryEntity[]>;
    update(id: string, orgId: string, data: Partial<CategoryEntity>): Promise<CategoryEntity | null>;
    softDelete(id: string, orgId: string): Promise<boolean>;
}
