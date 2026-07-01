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
exports.ReimbursementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reimbursement_entity_1 = require("./entities/reimbursement.entity");
let ReimbursementsService = class ReimbursementsService {
    constructor(reimbursementRepo) {
        this.reimbursementRepo = reimbursementRepo;
    }
    async createReimbursement(data) {
        const entity = this.reimbursementRepo.create({
            orgId: data.orgId,
            reportId: data.reportId,
            userId: data.userId,
            amount: data.amount,
            currency: data.currency,
            status: 'pending',
        });
        return this.reimbursementRepo.save(entity);
    }
    async findByReportId(reportId, orgId) {
        return this.reimbursementRepo.findOne({
            where: { reportId, orgId },
            relations: ['report'],
        });
    }
    async findAllByUser(orgId, userId) {
        return this.reimbursementRepo.find({
            where: { orgId, userId },
            relations: ['report'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllByOrg(orgId, status) {
        const where = { orgId };
        if (status) {
            where.status = status;
        }
        return this.reimbursementRepo.find({
            where,
            relations: ['report'],
            order: { createdAt: 'DESC' },
        });
    }
    async markAsProcessing(id, orgId, payrollRef) {
        const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
        if (!reimbursement) {
            throw new common_1.NotFoundException('Reimbursement not found');
        }
        reimbursement.status = 'processing';
        reimbursement.payrollRef = payrollRef;
        return this.reimbursementRepo.save(reimbursement);
    }
    async markAsCompleted(id, orgId) {
        const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
        if (!reimbursement) {
            throw new common_1.NotFoundException('Reimbursement not found');
        }
        reimbursement.status = 'completed';
        reimbursement.processedAt = new Date();
        return this.reimbursementRepo.save(reimbursement);
    }
    async markAsFailed(id, orgId) {
        const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
        if (!reimbursement) {
            throw new common_1.NotFoundException('Reimbursement not found');
        }
        reimbursement.status = 'failed';
        return this.reimbursementRepo.save(reimbursement);
    }
};
exports.ReimbursementsService = ReimbursementsService;
exports.ReimbursementsService = ReimbursementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reimbursement_entity_1.ReimbursementEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReimbursementsService);
//# sourceMappingURL=reimbursements.service.js.map