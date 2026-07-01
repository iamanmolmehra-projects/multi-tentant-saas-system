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
exports.PayrollReimbursementRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_reimbursement_entity_1 = require("../entities/payroll-reimbursement.entity");
let PayrollReimbursementRepository = class PayrollReimbursementRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findByEventId(eventId) {
        return this.repo.findOne({ where: { eventId } });
    }
    async findPendingByUser(orgId, userId) {
        return this.repo.find({
            where: { orgId, userId, status: 'pending' },
        });
    }
    async sumPendingByUser(orgId, userId) {
        const result = await this.repo
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.amount), 0)', 'total')
            .where('r.org_id = :orgId', { orgId })
            .andWhere('r.user_id = :userId', { userId })
            .andWhere('r.status = :status', { status: 'pending' })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async markAsIncluded(orgId, userId, runId) {
        await this.repo.update({ orgId, userId, status: 'pending' }, { status: 'included', includedInRunId: runId });
    }
    async findByRunId(runId) {
        return this.repo.find({
            where: { includedInRunId: runId },
        });
    }
};
exports.PayrollReimbursementRepository = PayrollReimbursementRepository;
exports.PayrollReimbursementRepository = PayrollReimbursementRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_reimbursement_entity_1.PayrollReimbursementEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PayrollReimbursementRepository);
//# sourceMappingURL=payroll-reimbursement.repository.js.map