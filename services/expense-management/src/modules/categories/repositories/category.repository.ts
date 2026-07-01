import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['children'],
    });
  }

  async findByCode(code: string, orgId: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({
      where: { code, orgId },
    });
  }

  async findAllByOrg(orgId: string, includeInactive = false): Promise<CategoryEntity[]> {
    const where: Record<string, unknown> = { orgId };
    if (!includeInactive) {
      where.isActive = true;
    }
    return this.repo.find({
      where,
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async update(id: string, orgId: string, data: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
    const result = await this.repo.update({ id, orgId }, data);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id, orgId);
  }

  async softDelete(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.softDelete({ id, orgId });
    return (result.affected ?? 0) > 0;
  }
}
