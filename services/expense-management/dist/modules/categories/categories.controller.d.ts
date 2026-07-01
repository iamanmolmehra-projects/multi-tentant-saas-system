import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(orgId: string, dto: CreateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity>;
    findAll(orgId: string): Promise<import("./entities/category.entity").CategoryEntity[]>;
    findOne(id: string, orgId: string): Promise<import("./entities/category.entity").CategoryEntity>;
    update(id: string, orgId: string, dto: Partial<CreateCategoryDto>): Promise<import("./entities/category.entity").CategoryEntity>;
    delete(id: string, orgId: string): Promise<void>;
}
