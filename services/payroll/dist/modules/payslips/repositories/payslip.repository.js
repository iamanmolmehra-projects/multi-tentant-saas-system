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
exports.PayslipRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payslip_entity_1 = require("../entities/payslip.entity");
let PayslipRepository = class PayslipRepository {
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
            relations: ['run'],
        });
    }
    async findByUser(orgId, userId, options) {
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
    async findByRunId(runId, orgId) {
        return this.repo.find({
            where: { runId, orgId },
            order: { createdAt: 'DESC' },
        });
    }
    async getYtdTotals(orgId, userId, financialYearStart, beforeDate) {
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
};
exports.PayslipRepository = PayslipRepository;
exports.PayslipRepository = PayslipRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payslip_entity_1.PayslipEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PayslipRepository);
//# sourceMappingURL=payslip.repository.js.map