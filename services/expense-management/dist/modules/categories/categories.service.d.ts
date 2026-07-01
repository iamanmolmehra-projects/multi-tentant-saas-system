import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    create(orgId: string, dto: CreateCategoryDto): Promise<CategoryEntity>;
    findAll(orgId: string, includeInactive?: boolean): Promise<CategoryEntity[]>;
    findById(id: string, orgId: string): Promise<CategoryEntity>;
    update(id: string, orgId: string, dto: Partial<CreateCategoryDto>): Promise<CategoryEntity>;
    deactivate(id: string, orgId: string): Promise<void>;
    delete(id: string, orgId: string): Promise<void>;
}
