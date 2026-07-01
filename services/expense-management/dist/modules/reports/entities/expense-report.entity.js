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
exports.ExpenseReportEntity = void 0;
const typeorm_1 = require("typeorm");
const expense_entity_1 = require("../../expenses/entities/expense.entity");
let ExpenseReportEntity = class ExpenseReportEntity {
};
exports.ExpenseReportEntity = ExpenseReportEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'draft' }),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ExpenseReportEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], ExpenseReportEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ExpenseReportEntity.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ExpenseReportEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ExpenseReportEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.VersionColumn)({ default: 1 }),
    __metadata("design:type", Number)
], ExpenseReportEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.ExpenseEntity, (expense) => expense.report),
    __metadata("design:type", Array)
], ExpenseReportEntity.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ExpenseReportEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ExpenseReportEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ExpenseReportEntity.prototype, "deletedAt", void 0);
exports.ExpenseReportEntity = ExpenseReportEntity = __decorate([
    (0, typeorm_1.Entity)('expense_reports')
], ExpenseReportEntity);
//# sourceMappingURL=expense-report.entity.js.map