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
exports.SalaryStructureEntity = void 0;
const typeorm_1 = require("typeorm");
let SalaryStructureEntity = class SalaryStructureEntity {
};
exports.SalaryStructureEntity = SalaryStructureEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalaryStructureEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], SalaryStructureEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], SalaryStructureEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'base_salary', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SalaryStructureEntity.prototype, "baseSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SalaryStructureEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SalaryStructureEntity.prototype, "components", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], SalaryStructureEntity.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date' }),
    __metadata("design:type", Date)
], SalaryStructureEntity.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], SalaryStructureEntity.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_current', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SalaryStructureEntity.prototype, "isCurrent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SalaryStructureEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SalaryStructureEntity.prototype, "updatedAt", void 0);
exports.SalaryStructureEntity = SalaryStructureEntity = __decorate([
    (0, typeorm_1.Entity)('salary_structures')
], SalaryStructureEntity);
//# sourceMappingURL=salary-structure.entity.js.map