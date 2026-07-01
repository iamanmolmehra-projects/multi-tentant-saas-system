import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryStructureEntity } from '../entities/salary-structure.entity';

@Injectable()
export class SalaryStructureRepository {
  constructor(
    @InjectRepository(SalaryStructureEntity)
    private readonly repo: Repository<SalaryStructureEntity>,
  ) {}

  async create(data: Partial<SalaryStructureEntity>): Promise<SalaryStructureEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findCurrentByUser(orgId: string, userId: string): Promise<SalaryStructureEntity | null> {
    return this.repo.findOne({
      where: { orgId, userId, isCurrent: true },
    });
  }

  async findHistoryByUser(
    orgId: string,
    userId: string,
  ): Promise<SalaryStructureEntity[]> {
    return this.repo.find({
      where: { orgId, userId },
      order: { effectiveFrom: 'DESC' },
    });
  }

  async findAllCurrentByOrg(orgId: string): Promise<SalaryStructureEntity[]> {
    return this.repo.find({
      where: { orgId, isCurrent: true },
    });
  }

  async markPreviousAsInactive(orgId: string, userId: string, effectiveTo: Date): Promise<void> {
    await this.repo.update(
      { orgId, userId, isCurrent: true },
      { isCurrent: false, effectiveTo },
    );
  }

  async findById(id: string, orgId: string): Promise<SalaryStructureEntity | null> {
    return this.repo.findOne({ where: { id, orgId } });
  }
}
