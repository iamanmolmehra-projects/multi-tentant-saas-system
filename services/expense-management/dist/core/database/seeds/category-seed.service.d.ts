import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../modules/categories/entities/category.entity';
export declare class CategorySeedService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<CategoryEntity>);
    run(): Promise<void>;
    seedForOrg(orgId: string): Promise<void>;
}
