import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollReimbursementEntity } from '../entities/payroll-reimbursement.entity';

@Injectable()
export class PayrollReimbursementRepository {
  constructor(
    @InjectRepository(PayrollReimbursementEntity)
    private readonly repo: Repository<PayrollReimbursementEntity>,
  ) {}

  async create(data: Partial<PayrollReimbursementEntity>): Promise<PayrollReimbursementEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findByEventId(eventId: string): Promise<PayrollReimbursementEntity | null> {
    return this.repo.findOne({ where: { eventId } });
  }

  async findPendingByUser(orgId: string, userId: string): Promise<PayrollReimbursementEntity[]> {
    return this.repo.find({
      where: { orgId, userId, status: 'pending' },
    });
  }

  async sumPendingByUser(orgId: string, userId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.amount), 0)', 'total')
      .where('r.org_id = :orgId', { orgId })
      .andWhere('r.user_id = :userId', { userId })
      .andWhere('r.status = :status', { status: 'pending' })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  async markAsIncluded(orgId: string, userId: string, runId: string): Promise<void> {
    await this.repo.update(
      { orgId, userId, status: 'pending' },
      { status: 'included', includedInRunId: runId },
    );
  }

  async findByRunId(runId: string): Promise<PayrollReimbursementEntity[]> {
    return this.repo.find({
      where: { includedInRunId: runId },
    });
  }
}
