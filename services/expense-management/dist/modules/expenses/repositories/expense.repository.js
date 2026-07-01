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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("../entities/expense.entity");
let ExpenseRepository = class ExpenseRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findById(id, orgId) {
        return this.repo.findOne({
            where: { id, orgId },
            relations: ['category', 'report'],
        });
    }
    async findByIdempotencyKey(key) {
        return this.repo.findOne({
            where: { idempotencyKey: key },
        });
    }
    async findAllByOrg(orgId, options) {
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
    async sumByUserAndPeriod(orgId, userId, categoryId, fromDate, toDate) {
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
    async update(id, orgId, data) {
        const result = await this.repo.update({ id, orgId }, data);
        if (result.affected === 0) {
            return null;
        }
        return this.findById(id, orgId);
    }
    async softDelete(id, orgId) {
        const result = await this.repo.softDelete({ id, orgId });
        return (result.affected ?? 0) > 0;
    }
    async findByReportId(reportId, orgId) {
        return this.repo.find({
            where: { reportId, orgId },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ExpenseRepository = ExpenseRepository;
exports.ExpenseRepository = ExpenseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.ExpenseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpenseRepository);
//# sourceMappingURL=expense.repository.js.map