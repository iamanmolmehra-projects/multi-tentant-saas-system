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
exports.ReimbursementEntity = void 0;
const typeorm_1 = require("typeorm");
const expense_report_entity_1 = require("../../reports/entities/expense-report.entity");
let ReimbursementEntity = class ReimbursementEntity {
};
exports.ReimbursementEntity = ReimbursementEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_report_entity_1.ExpenseReportEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", expense_report_entity_1.ExpenseReportEntity)
], ReimbursementEntity.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], ReimbursementEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'pending' }),
    __metadata("design:type", String)
], ReimbursementEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payroll_ref', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ReimbursementEntity.prototype, "payrollRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ReimbursementEntity.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ReimbursementEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ReimbursementEntity.prototype, "updatedAt", void 0);
exports.ReimbursementEntity = ReimbursementEntity = __decorate([
    (0, typeorm_1.Entity)('reimbursements')
], ReimbursementEntity);
//# sourceMappingURL=reimbursement.entity.js.map