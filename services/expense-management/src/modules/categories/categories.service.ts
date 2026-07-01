import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(orgId: string, dto: CreateCategoryDto): Promise<CategoryEntity> {
    // Check uniqueness of code within org
    const existing = await this.categoryRepository.findByCode(dto.code, orgId);
    if (existing) {
      throw new ConflictException(`Category with code '${dto.code}' already exists in this organization`);
    }

    return this.categoryRepository.create({
      orgId,
      name: dto.name,
      code: dto.code,
      description: dto.description || null,
      parentId: dto.parentId || null,
    });
  }

  async findAll(orgId: string, includeInactive = false): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAllByOrg(orgId, includeInactive);
  }

  async findById(id: string, orgId: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id, orgId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    orgId: string,
    dto: Partial<CreateCategoryDto>,
  ): Promise<CategoryEntity> {
    // If updating code, check uniqueness
    if (dto.code) {
      const existing = await this.categoryRepository.findByCode(dto.code, orgId);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Category with code '${dto.code}' already exists`);
      }
    }

    const updateData: Partial<CategoryEntity> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.code !== undefined) updateData.code = dto.code;
    if (dto.description !== undefined) updateData.description = dto.description || null;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId || null;

    const updated = await this.categoryRepository.update(id, orgId, updateData);
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }

  async deactivate(id: string, orgId: string): Promise<void> {
    const updated = await this.categoryRepository.update(id, orgId, { isActive: false });
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
  }

  async delete(id: string, orgId: string): Promise<void> {
    const success = await this.categoryRepository.softDelete(id, orgId);
    if (!success) {
      throw new NotFoundException('Category not found');
    }
  }
}
