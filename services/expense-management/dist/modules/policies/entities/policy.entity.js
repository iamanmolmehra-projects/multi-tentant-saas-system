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
exports.PolicyEntity = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
let PolicyEntity = class PolicyEntity {
};
exports.PolicyEntity = PolicyEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PolicyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], PolicyEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], PolicyEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.CategoryEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_amount', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "maxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PolicyEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'requires_receipt_above',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "requiresReceiptAbove", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'auto_approve_below',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PolicyEntity.prototype, "autoApproveBelow", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PolicyEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyEntity.prototype, "updatedAt", void 0);
exports.PolicyEntity = PolicyEntity = __decorate([
    (0, typeorm_1.Entity)('expense_policies')
], PolicyEntity);
//# sourceMappingURL=policy.entity.js.map