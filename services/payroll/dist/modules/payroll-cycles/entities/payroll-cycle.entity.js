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
exports.PayrollCycleEntity = void 0;
const typeorm_1 = require("typeorm");
const payroll_run_entity_1 = require("../../payroll-runs/entities/payroll-run.entity");
let PayrollCycleEntity = class PayrollCycleEntity {
};
exports.PayrollCycleEntity = PayrollCycleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PayrollCycleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollCycleEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PayrollCycleEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], PayrollCycleEntity.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pay_day', type: 'int' }),
    __metadata("design:type", Number)
], PayrollCycleEntity.prototype, "payDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], PayrollCycleEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PayrollCycleEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PayrollCycleEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payroll_run_entity_1.PayrollRunEntity, (run) => run.cycle),
    __metadata("design:type", Array)
], PayrollCycleEntity.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollCycleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollCycleEntity.prototype, "updatedAt", void 0);
exports.PayrollCycleEntity = PayrollCycleEntity = __decorate([
    (0, typeorm_1.Entity)('payroll_cycles')
], PayrollCycleEntity);
//# sourceMappingURL=payroll-cycle.entity.js.map