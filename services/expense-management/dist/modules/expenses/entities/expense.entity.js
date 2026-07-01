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
exports.ExpenseEntity = void 0;
const typeorm_1 = require("typeorm");
const expense_report_entity_1 = require("../../reports/entities/expense-report.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
let ExpenseEntity = class ExpenseEntity {
};
exports.ExpenseEntity = ExpenseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_report_entity_1.ExpenseReportEntity, (report) => report.expenses, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.CategoryEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], ExpenseEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_date', type: 'date' }),
    __metadata("design:type", Date)
], ExpenseEntity.prototype, "expenseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "merchantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_url', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "receiptUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_metadata', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "receiptMetadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'draft' }),
    __metadata("design:type", String)
], ExpenseEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_violation', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "policyViolation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ExpenseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ExpenseEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ExpenseEntity.prototype, "deletedAt", void 0);
exports.ExpenseEntity = ExpenseEntity = __decorate([
    (0, typeorm_1.Entity)('expenses')
], ExpenseEntity);
//# sourceMappingURL=expense.entity.js.map