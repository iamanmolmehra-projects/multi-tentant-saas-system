import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReportEntity } from '../entities/expense-report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(ExpenseReportEntity)
    private readonly repo: Repository<ExpenseReportEntity>,
  ) {}

  async create(data: Partial<ExpenseReportEntity>): Promise<ExpenseReportEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<ExpenseReportEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['expenses', 'expenses.category'],
    });
  }

  async findAllByOrg(
    orgId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      userId?: string;
    },
  ): Promise<[ExpenseReportEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder('report')
      .where('report.org_id = :orgId', { orgId });

    if (options.status) {
      qb.andWhere('report.status = :status', { status: options.status });
    }

    if (options.userId) {
      qb.andWhere('report.user_id = :userId', { userId: options.userId });
    }

    qb.skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('report.created_at', 'DESC');

    return qb.getManyAndCount();
  }

  /**
   * Optimistic locking update using version column.
   */
  async updateWithLock(
    id: string,
    orgId: string,
    data: Partial<ExpenseReportEntity>,
    expectedVersion: number,
  ): Promise<ExpenseReportEntity | null> {
    const result = await this.repo
      .createQueryBuilder()
      .update(ExpenseReportEntity)
      .set(data as any)
      .where('id = :id AND org_id = :orgId AND version = :expectedVersion', {
        id,
        orgId,
        expectedVersion,
      })
      .execute();

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
