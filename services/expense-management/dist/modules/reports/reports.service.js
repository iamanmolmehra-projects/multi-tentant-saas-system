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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const report_repository_1 = require("./repositories/report.repository");
const expense_repository_1 = require("../expenses/repositories/expense.repository");
let ReportsService = class ReportsService {
    constructor(reportRepository, expenseRepository) {
        this.reportRepository = reportRepository;
        this.expenseRepository = expenseRepository;
    }
    async create(orgId, userId, dto) {
        return this.reportRepository.create({
            orgId,
            userId,
            title: dto.title,
            currency: dto.currency || 'INR',
            status: 'draft',
            totalAmount: 0,
        });
    }
    async findAll(orgId, userId, query) {
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
    async findAllForOrg(orgId, query) {
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
    async findById(id, orgId) {
        const report = await this.reportRepository.findById(id, orgId);
        if (!report) {
            throw new common_1.NotFoundException('Expense report not found');
        }
        return report;
    }
    async submit(id, orgId, userId) {
        const report = await this.findById(id, orgId);
        if (report.userId !== userId) {
            throw new common_1.ForbiddenException('You can only submit your own reports');
        }
        if (report.status !== 'draft') {
            throw new common_1.ConflictException('Report can only be submitted from draft status');
        }
        const expenses = await this.expenseRepository.findByReportId(id, orgId);
        if (expenses.length === 0) {
            throw new common_1.ConflictException('Cannot submit a report with no expenses');
        }
        const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        const updated = await this.reportRepository.updateWithLock(id, orgId, {
            status: 'submitted',
            totalAmount,
            submittedAt: new Date(),
        }, report.version);
        if (!updated) {
            throw new common_1.ConflictException('Report was modified by another process. Please refresh and try again.');
        }
        return updated;
    }
    async approve(id, orgId, approverId) {
        const report = await this.findById(id, orgId);
        if (report.status !== 'submitted') {
            throw new common_1.ConflictException('Report can only be approved from submitted status');
        }
        if (report.userId === approverId) {
            throw new common_1.ForbiddenException('You cannot approve your own report');
        }
        const updated = await this.reportRepository.updateWithLock(id, orgId, {
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: approverId,
        }, report.version);
        if (!updated) {
            throw new common_1.ConflictException('Report was modified by another process. Please refresh and try again.');
        }
        return updated;
    }
    async reject(id, orgId, approverId) {
        const report = await this.findById(id, orgId);
        if (report.status !== 'submitted') {
            throw new common_1.ConflictException('Report can only be rejected from submitted status');
        }
        const updated = await this.reportRepository.updateWithLock(id, orgId, { status: 'rejected' }, report.version);
        if (!updated) {
            throw new common_1.ConflictException('Report was modified by another process. Please refresh and try again.');
        }
        return updated;
    }
    async delete(id, orgId, userId) {
        const report = await this.findById(id, orgId);
        if (report.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reports');
        }
        if (report.status !== 'draft') {
            throw new common_1.ConflictException('Can only delete reports in draft status');
        }
        const success = await this.reportRepository.softDelete(id, orgId);
        if (!success) {
            throw new common_1.NotFoundException('Report not found');
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository,
        expense_repository_1.ExpenseRepository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map