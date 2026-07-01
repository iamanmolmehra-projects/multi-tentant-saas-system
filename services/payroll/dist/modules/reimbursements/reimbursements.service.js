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
var ReimbursementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementsService = void 0;
const common_1 = require("@nestjs/common");
const payroll_reimbursement_repository_1 = require("./repositories/payroll-reimbursement.repository");
let ReimbursementsService = ReimbursementsService_1 = class ReimbursementsService {
    constructor(reimbursementRepository) {
        this.reimbursementRepository = reimbursementRepository;
        this.logger = new common_1.Logger(ReimbursementsService_1.name);
    }
    async handleReimbursementApproved(event) {
        const existing = await this.reimbursementRepository.findByEventId(event.eventId);
        if (existing) {
            this.logger.log(`Duplicate event received: ${event.eventId}, skipping`);
            return existing;
        }
        const reimbursement = await this.reimbursementRepository.create({
            orgId: event.orgId,
            userId: event.userId,
            expenseReportId: event.expenseReportId,
            amount: event.amount,
            currency: event.currency || 'INR',
            status: 'pending',
            eventId: event.eventId,
        });
        this.logger.log(`Reimbursement queued: ${reimbursement.id} for user ${event.userId} - amount ${event.amount}`);
        return reimbursement;
    }
    async getPendingTotal(orgId, userId) {
        return this.reimbursementRepository.sumPendingByUser(orgId, userId);
    }
    async markAsIncluded(orgId, userId, runId) {
        await this.reimbursementRepository.markAsIncluded(orgId, userId, runId);
    }
    async findByRunId(runId) {
        return this.reimbursementRepository.findByRunId(runId);
    }
};
exports.ReimbursementsService = ReimbursementsService;
exports.ReimbursementsService = ReimbursementsService = ReimbursementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_reimbursement_repository_1.PayrollReimbursementRepository])
], ReimbursementsService);
//# sourceMappingURL=reimbursements.service.js.map