"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const expense_repository_1 = require("./repositories/expense.repository");
const policies_service_1 = require("../policies/policies.service");
let ExpensesService = class ExpensesService {
    constructor(expenseRepository, policiesService) {
        this.expenseRepository = expenseRepository;
        this.policiesService = policiesService;
    }
    async create(orgId, userId, roleId, dto) {
        if (dto.idempotencyKey) {
            const existing = await this.expenseRepository.findByIdempotencyKey(dto.idempotencyKey);
            if (existing) {
                return existing;
            }
        }
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
    async findAll(orgId, userId, query) {
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
    async findAllForOrg(orgId, query) {
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
    async findById(id, orgId) {
        const expense = await this.expenseRepository.findById(id, orgId);
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async update(id, orgId, userId, dto) {
        const expense = await this.findById(id, orgId);
        if (expense.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own expenses');
        }
        if (!['draft', 'flagged'].includes(expense.status)) {
            throw new common_1.ConflictException('Can only update expenses in draft or flagged status');
        }
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.description !== undefined)
            updateData.description = dto.description || null;
        if (dto.amount !== undefined)
            updateData.amount = dto.amount;
        if (dto.currency !== undefined)
            updateData.currency = dto.currency;
        if (dto.expenseDate !== undefined)
            updateData.expenseDate = new Date(dto.expenseDate);
        if (dto.categoryId !== undefined)
            updateData.categoryId = dto.categoryId || null;
        if (dto.reportId !== undefined)
            updateData.reportId = dto.reportId || null;
        if (dto.merchantName !== undefined)
            updateData.merchantName = dto.merchantName || null;
        if (dto.receiptUrl !== undefined)
            updateData.receiptUrl = dto.receiptUrl || null;
        if (dto.receiptMetadata !== undefined)
            updateData.receiptMetadata = dto.receiptMetadata || null;
        const updated = await this.expenseRepository.update(id, orgId, updateData);
        if (!updated) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return updated;
    }
    async delete(id, orgId, userId) {
        const expense = await this.findById(id, orgId);
        if (expense.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own expenses');
        }
        if (!['draft', 'flagged'].includes(expense.status)) {
            throw new common_1.ConflictException('Can only delete expenses in draft or flagged status');
        }
        const success = await this.expenseRepository.softDelete(id, orgId);
        if (!success) {
            throw new common_1.NotFoundException('Expense not found');
        }
    }
    async findByReportId(reportId, orgId) {
        return this.expenseRepository.findByReportId(reportId, orgId);
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expense_repository_1.ExpenseRepository,
        policies_service_1.PoliciesService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map