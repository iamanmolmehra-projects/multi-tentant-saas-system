import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyEntity } from '../entities/policy.entity';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectRepository(PolicyEntity)
    private readonly repo: Repository<PolicyEntity>,
  ) {}

  async create(data: Partial<PolicyEntity>): Promise<PolicyEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<PolicyEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['category'],
    });
  }

  async findAllByOrg(orgId: string, activeOnly = true): Promise<PolicyEntity[]> {
    const where: Record<string, unknown> = { orgId };
    if (activeOnly) {
      where.isActive = true;
    }
    return this.repo.find({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findApplicablePolicies(
    orgId: string,
    categoryId: string | null,
    roleId: string | null,
  ): Promise<PolicyEntity[]> {
    const qb = this.repo
      .createQueryBuilder('policy')
      .where('policy.org_id = :orgId', { orgId })
      .andWhere('policy.is_active = true');

    // Find policies that match the category OR are global (null category)
    if (categoryId) {
      qb.andWhere('(policy.category_id = :categoryId OR policy.category_id IS NULL)', {
        categoryId,
      });
    } else {
      qb.andWhere('policy.category_id IS NULL');
    }

    // Find policies that match the role OR are global (null role)
    if (roleId) {
      qb.andWhere('(policy.role_id = :roleId OR policy.role_id IS NULL)', { roleId });
    } else {
      qb.andWhere('policy.role_id IS NULL');
    }

    return qb.getMany();
  }

  async update(id: string, orgId: string, data: Partial<PolicyEntity>): Promise<PolicyEntity | null> {
    const result = await this.repo.update({ id, orgId }, data);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id, orgId);
  }

  async delete(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.delete({ id, orgId });
    return (result.affected ?? 0) > 0;
  }
}
