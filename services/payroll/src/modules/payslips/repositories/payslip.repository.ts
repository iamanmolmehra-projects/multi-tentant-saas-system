import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayslipEntity } from '../entities/payslip.entity';

@Injectable()
export class PayslipRepository {
  constructor(
    @InjectRepository(PayslipEntity)
    private readonly repo: Repository<PayslipEntity>,
  ) {}

  async create(data: Partial<PayslipEntity>): Promise<PayslipEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<PayslipEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['run'],
    });
  }

  async findByUser(
    orgId: string,
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<[PayslipEntity[], number]> {
    const page = options?.page || 1;
    const limit = options?.limit || 12;

    return this.repo.findAndCount({
      where: { orgId, userId },
      relations: ['run'],
      order: { periodStart: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByRunId(runId: string, orgId: string): Promise<PayslipEntity[]> {
    return this.repo.find({
      where: { runId, orgId },
      order: { createdAt: 'DESC' },
    });
  }

  async getYtdTotals(
    orgId: string,
    userId: string,
    financialYearStart: Date,
    beforeDate: Date,
  ): Promise<{ ytdGross: number; ytdTax: number }> {
    const result = await this.repo
      .createQueryBuilder('payslip')
      .select('COALESCE(SUM(payslip.gross_salary), 0)', 'ytdGross')
      .addSelect("COALESCE(SUM((payslip.deductions->>'tax')::numeric), 0)", 'ytdTax')
      .where('payslip.org_id = :orgId', { orgId })
      .andWhere('payslip.user_id = :userId', { userId })
      .andWhere('payslip.period_start >= :fyStart', { fyStart: financialYearStart })
      .andWhere('payslip.period_start < :beforeDate', { beforeDate })
      .getRawOne();

    return {
      ytdGross: parseFloat(result?.ytdGross || '0'),
      ytdTax: parseFloat(result?.ytdTax || '0'),
    };
  }
}
