import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginatedResult } from '@multi-tenant/shared';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseRepository } from './repositories/expense.repository';
import { PoliciesService } from '../policies/policies.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly policiesService: PoliciesService,
  ) {}

  async create(
    orgId: string,
    userId: string,
    roleId: string,
    dto: CreateExpenseDto,
  ): Promise<ExpenseEntity> {
    // Idempotency check
    if (dto.idempotencyKey) {
      const existing = await this.expenseRepository.findByIdempotencyKey(dto.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    // Validate against expense policies
    const policyViolation = await this.policiesService.validateExpense(orgId, {
      amount: dto.amount,
      categoryId: dto.categoryId || null,
      roleId,
      userId,
      expenseDate: new Date(dto.expenseDate),
      receiptUrl: dto.receiptUrl || null,
    });

    const expense = await this.expenseRepository.create({
      orgId,
      userId,
      title: dto.title,
      description: dto.description || null,
      amount: dto.amount,
      currency: dto.currency || 'INR',
      expenseDate: new Date(dto.expenseDate),
      categoryId: dto.categoryId || null,
      reportId: dto.reportId || null,
      merchantName: dto.merchantName || null,
      receiptUrl: dto.receiptUrl || null,
      receiptMetadata: dto.receiptMetadata || null,
      idempotencyKey: dto.idempotencyKey || null,
      policyViolation,
      status: policyViolation ? 'flagged' : 'draft',
    });

    return expense;
  }

  async findAll(
    orgId: string,
    userId: string,
    query: QueryExpensesDto,
  ): Promise<IPaginatedResult<ExpenseEntity>> {
    const [data, totalItems] = await this.expenseRepository.findAllByOrg(orgId, {
      page: query.page,
      limit: query.limit,
      status: query.status,
      categoryId: query.categoryId,
      reportId: query.reportId,
      userId,
      fromDate: query.fromDate,
      toDate: query.toDate,
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
    query: QueryExpensesDto,
  ): Promise<IPaginatedResult<ExpenseEntity>> {
    const [data, totalItems] = await this.expenseRepository.findAllByOrg(orgId, {
      page: query.page,
      limit: query.limit,
      status: query.status,
      categoryId: query.categoryId,
      reportId: query.reportId,
      fromDate: query.fromDate,
      toDate: query.toDate,
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

  async findById(id: string, orgId: string): Promise<ExpenseEntity> {
    const expense = await this.expenseRepository.findById(id, orgId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(
    id: string,
    orgId: string,
    userId: string,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseEntity> {
    const expense = await this.findById(id, orgId);

    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only update your own expenses');
    }

    if (!['draft', 'flagged'].includes(expense.status)) {
      throw new ConflictException('Can only update expenses in draft or flagged status');
    }

    const updateData: Partial<ExpenseEntity> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description || null;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.expenseDate !== undefined) updateData.expenseDate = new Date(dto.expenseDate);
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId || null;
    if (dto.reportId !== undefined) updateData.reportId = dto.reportId || null;
    if (dto.merchantName !== undefined) updateData.merchantName = dto.merchantName || null;
    if (dto.receiptUrl !== undefined) updateData.receiptUrl = dto.receiptUrl || null;
    if (dto.receiptMetadata !== undefined) updateData.receiptMetadata = dto.receiptMetadata || null;

    const updated = await this.expenseRepository.update(id, orgId, updateData);
    if (!updated) {
      throw new NotFoundException('Expense not found');
    }
    return updated;
  }

  async delete(id: string, orgId: string, userId: string): Promise<void> {
    const expense = await this.findById(id, orgId);

    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only delete your own expenses');
    }

    if (!['draft', 'flagged'].includes(expense.status)) {
      throw new ConflictException('Can only delete expenses in draft or flagged status');
    }

    const success = await this.expenseRepository.softDelete(id, orgId);
    if (!success) {
      throw new NotFoundException('Expense not found');
    }
  }

  async findByReportId(reportId: string, orgId: string): Promise<ExpenseEntity[]> {
    return this.expenseRepository.findByReportId(reportId, orgId);
  }
}
