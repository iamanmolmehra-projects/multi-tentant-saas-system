import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from '../entities/expense.entity';

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly repo: Repository<ExpenseEntity>,
  ) {}

  async create(data: Partial<ExpenseEntity>): Promise<ExpenseEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<ExpenseEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['category', 'report'],
    });
  }

  async findByIdempotencyKey(key: string): Promise<ExpenseEntity | null> {
    return this.repo.findOne({
      where: { idempotencyKey: key },
    });
  }

  async findAllByOrg(
    orgId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      categoryId?: string;
      reportId?: string;
      userId?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<[ExpenseEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.report', 'report')
      .where('expense.org_id = :orgId', { orgId });

    if (options.status) {
      qb.andWhere('expense.status = :status', { status: options.status });
    }

    if (options.categoryId) {
      qb.andWhere('expense.category_id = :categoryId', { categoryId: options.categoryId });
    }

    if (options.reportId) {
      qb.andWhere('expense.report_id = :reportId', { reportId: options.reportId });
    }

    if (options.userId) {
      qb.andWhere('expense.user_id = :userId', { userId: options.userId });
    }

    if (options.fromDate) {
      qb.andWhere('expense.expense_date >= :fromDate', { fromDate: options.fromDate });
    }

    if (options.toDate) {
      qb.andWhere('expense.expense_date <= :toDate', { toDate: options.toDate });
    }

    qb.skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('expense.created_at', 'DESC');

    return qb.getManyAndCount();
  }

  async sumByUserAndPeriod(
    orgId: string,
    userId: string,
    categoryId: string | null,
    fromDate: Date,
    toDate: Date,
  ): Promise<number> {
    const qb = this.repo
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.org_id = :orgId', { orgId })
      .andWhere('expense.user_id = :userId', { userId })
      .andWhere('expense.expense_date BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .andWhere('expense.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['rejected', 'cancelled'],
      });

    if (categoryId) {
      qb.andWhere('expense.category_id = :categoryId', { categoryId });
    }

    const result = await qb.getRawOne();
    return parseFloat(result?.total || '0');
  }

  async update(id: string, orgId: string, data: Partial<ExpenseEntity>): Promise<ExpenseEntity | null> {
    const result = await this.repo.update({ id, orgId }, data as any);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id, orgId);
  }

  async softDelete(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.softDelete({ id, orgId });
    return (result.affected ?? 0) > 0;
  }

  async findByReportId(reportId: string, orgId: string): Promise<ExpenseEntity[]> {
    return this.repo.find({
      where: { reportId, orgId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }
}
