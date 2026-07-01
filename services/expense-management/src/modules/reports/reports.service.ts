import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginatedResult, PaginationQueryDto } from '@multi-tenant/shared';
import { ExpenseReportEntity } from './entities/expense-report.entity';
import { ReportRepository } from './repositories/report.repository';
import { ExpenseRepository } from '../expenses/repositories/expense.repository';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async create(orgId: string, userId: string, dto: CreateReportDto): Promise<ExpenseReportEntity> {
    return this.reportRepository.create({
      orgId,
      userId,
      title: dto.title,
      currency: dto.currency || 'INR',
      status: 'draft',
      totalAmount: 0,
    });
  }

  async findAll(
    orgId: string,
    userId: string,
    query: PaginationQueryDto & { status?: string },
  ): Promise<IPaginatedResult<ExpenseReportEntity>> {
    const [data, totalItems] = await this.reportRepository.findAllByOrg(orgId, {
      page: query.page,
      limit: query.limit,
      status: query.status,
      userId,
    });

    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findAllForOrg(
    orgId: string,
    query: PaginationQueryDto & { status?: string },
  ): Promise<IPaginatedResult<ExpenseReportEntity>> {
    const [data, totalItems] = await this.reportRepository.findAllByOrg(orgId, {
      page: query.page,
      limit: query.limit,
      status: query.status,
    });

    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findById(id: string, orgId: string): Promise<ExpenseReportEntity> {
    const report = await this.reportRepository.findById(id, orgId);
    if (!report) {
      throw new NotFoundException('Expense report not found');
    }
    return report;
  }

  /**
   * Submit a report for approval. Uses optimistic locking to prevent concurrent modifications.
   */
  async submit(id: string, orgId: string, userId: string): Promise<ExpenseReportEntity> {
    const report = await this.findById(id, orgId);

    if (report.userId !== userId) {
      throw new ForbiddenException('You can only submit your own reports');
    }

    if (report.status !== 'draft') {
      throw new ConflictException('Report can only be submitted from draft status');
    }

    // Calculate total from expenses
    const expenses = await this.expenseRepository.findByReportId(id, orgId);
    if (expenses.length === 0) {
      throw new ConflictException('Cannot submit a report with no expenses');
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const updated = await this.reportRepository.updateWithLock(
      id,
      orgId,
      {
        status: 'submitted',
        totalAmount,
        submittedAt: new Date(),
      },
      report.version,
    );

    if (!updated) {
      throw new ConflictException(
        'Report was modified by another process. Please refresh and try again.',
      );
    }

    return updated;
  }

  /**
   * Approve a submitted report. Uses optimistic locking.
   */
  async approve(
    id: string,
    orgId: string,
    approverId: string,
  ): Promise<ExpenseReportEntity> {
    const report = await this.findById(id, orgId);

    if (report.status !== 'submitted') {
      throw new ConflictException('Report can only be approved from submitted status');
    }

    if (report.userId === approverId) {
      throw new ForbiddenException('You cannot approve your own report');
    }

    const updated = await this.reportRepository.updateWithLock(
      id,
      orgId,
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: approverId,
      },
      report.version,
    );

    if (!updated) {
      throw new ConflictException(
        'Report was modified by another process. Please refresh and try again.',
      );
    }

    return updated;
  }

  /**
   * Reject a submitted report. Uses optimistic locking.
   */
  async reject(
    id: string,
    orgId: string,
    approverId: string,
  ): Promise<ExpenseReportEntity> {
    const report = await this.findById(id, orgId);

    if (report.status !== 'submitted') {
      throw new ConflictException('Report can only be rejected from submitted status');
    }

    const updated = await this.reportRepository.updateWithLock(
      id,
      orgId,
      { status: 'rejected' },
      report.version,
    );

    if (!updated) {
      throw new ConflictException(
        'Report was modified by another process. Please refresh and try again.',
      );
    }

    return updated;
  }

  async delete(id: string, orgId: string, userId: string): Promise<void> {
    const report = await this.findById(id, orgId);

    if (report.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reports');
    }

    if (report.status !== 'draft') {
      throw new ConflictException('Can only delete reports in draft status');
    }

    const success = await this.reportRepository.softDelete(id, orgId);
    if (!success) {
      throw new NotFoundException('Report not found');
    }
  }
}
