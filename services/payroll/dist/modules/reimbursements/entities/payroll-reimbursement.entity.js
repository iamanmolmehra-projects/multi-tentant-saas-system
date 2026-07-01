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
exports.PayrollReimbursementEntity = void 0;
const typeorm_1 = require("typeorm");
const payroll_run_entity_1 = require("../../payroll-runs/entities/payroll-run.entity");
let PayrollReimbursementEntity = class PayrollReimbursementEntity {
};
exports.PayrollReimbursementEntity = PayrollReimbursementEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_report_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "expenseReportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PayrollReimbursementEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'pending' }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'included_in_run_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PayrollReimbursementEntity.prototype, "includedInRunId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payroll_run_entity_1.PayrollRunEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'included_in_run_id' }),
    __metadata("design:type", Object)
], PayrollReimbursementEntity.prototype, "includedInRun", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'varchar', length: 64, unique: true }),
    __metadata("design:type", String)
], PayrollReimbursementEntity.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollReimbursementEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollReimbursementEntity.prototype, "updatedAt", void 0);
exports.PayrollReimbursementEntity = PayrollReimbursementEntity = __decorate([
    (0, typeorm_1.Entity)('payroll_reimbursements')
], PayrollReimbursementEntity);
//# sourceMappingURL=payroll-reimbursement.entity.js.map