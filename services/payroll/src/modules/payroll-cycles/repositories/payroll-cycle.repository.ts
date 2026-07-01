import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollCycleEntity } from '../entities/payroll-cycle.entity';

@Injectable()
export class PayrollCycleRepository {
  constructor(
    @InjectRepository(PayrollCycleEntity)
    private readonly repo: Repository<PayrollCycleEntity>,
  ) {}

  async create(data: Partial<PayrollCycleEntity>): Promise<PayrollCycleEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAllByOrg(orgId: string): Promise<PayrollCycleEntity[]> {
    return this.repo.find({
      where: { orgId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, orgId: string): Promise<PayrollCycleEntity | null> {
    return this.repo.findOne({ where: { id, orgId } });
  }

  async findActiveByOrg(orgId: string): Promise<PayrollCycleEntity[]> {
    return this.repo.find({
      where: { orgId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
