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
exports.ApprovalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const approval_entity_1 = require("./entities/approval.entity");
let ApprovalsService = class ApprovalsService {
    constructor(approvalRepo) {
        this.approvalRepo = approvalRepo;
    }
    async createApproval(data) {
        const entity = this.approvalRepo.create({
            orgId: data.orgId,
            expenseId: data.expenseId || null,
            reportId: data.reportId || null,
            approverId: data.approverId,
            level: data.level,
            status: 'pending',
        });
        return this.approvalRepo.save(entity);
    }
    async approve(id, orgId, approverId, comments) {
        const approval = await this.approvalRepo.findOne({ where: { id, orgId } });
        if (!approval) {
            throw new common_1.NotFoundException('Approval not found');
        }
        approval.status = 'approved';
        approval.comments = comments || null;
        approval.decidedAt = new Date();
        return this.approvalRepo.save(approval);
    }
    async reject(id, orgId, approverId, comments) {
        const approval = await this.approvalRepo.findOne({ where: { id, orgId } });
        if (!approval) {
            throw new common_1.NotFoundException('Approval not found');
        }
        approval.status = 'rejected';
        approval.comments = comments || null;
        approval.decidedAt = new Date();
        return this.approvalRepo.save(approval);
    }
    async findPendingByApprover(orgId, approverId) {
        return this.approvalRepo.find({
            where: { orgId, approverId, status: 'pending' },
            relations: ['expense', 'report'],
            order: { createdAt: 'ASC' },
        });
    }
    async findByReportId(reportId, orgId) {
        return this.approvalRepo.find({
            where: { reportId, orgId },
            order: { level: 'ASC', createdAt: 'ASC' },
        });
    }
    async findByExpenseId(expenseId, orgId) {
        return this.approvalRepo.find({
            where: { expenseId, orgId },
            order: { level: 'ASC', createdAt: 'ASC' },
        });
    }
};
exports.ApprovalsService = ApprovalsService;
exports.ApprovalsService = ApprovalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(approval_entity_1.ApprovalEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApprovalsService);
//# sourceMappingURL=approvals.service.js.map