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
exports.ApprovalEntity = void 0;
const typeorm_1 = require("typeorm");
const expense_entity_1 = require("../../expenses/entities/expense.entity");
const expense_report_entity_1 = require("../../reports/entities/expense-report.entity");
let ApprovalEntity = class ApprovalEntity {
};
exports.ApprovalEntity = ApprovalEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], ApprovalEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "expenseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_entity_1.ExpenseEntity, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'expense_id' }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "expense", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_report_entity_1.ExpenseReportEntity, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approver_id', type: 'uuid' }),
    __metadata("design:type", String)
], ApprovalEntity.prototype, "approverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ApprovalEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], ApprovalEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'decided_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ApprovalEntity.prototype, "decidedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ApprovalEntity.prototype, "createdAt", void 0);
exports.ApprovalEntity = ApprovalEntity = __decorate([
    (0, typeorm_1.Entity)('expense_approvals')
], ApprovalEntity);
//# sourceMappingURL=approval.entity.js.map