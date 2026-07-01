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
exports.PayrollRunEntity = void 0;
const typeorm_1 = require("typeorm");
const payroll_cycle_entity_1 = require("../../payroll-cycles/entities/payroll-cycle.entity");
const payslip_entity_1 = require("../../payslips/entities/payslip.entity");
let PayrollRunEntity = class PayrollRunEntity {
};
exports.PayrollRunEntity = PayrollRunEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PayrollRunEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollRunEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cycle_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayrollRunEntity.prototype, "cycleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payroll_cycle_entity_1.PayrollCycleEntity, (cycle) => cycle.runs, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'cycle_id' }),
    __metadata("design:type", payroll_cycle_entity_1.PayrollCycleEntity)
], PayrollRunEntity.prototype, "cycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_start', type: 'date' }),
    __metadata("design:type", Date)
], PayrollRunEntity.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_end', type: 'date' }),
    __metadata("design:type", Date)
], PayrollRunEntity.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'pending' }),
    __metadata("design:type", String)
], PayrollRunEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_gross', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollRunEntity.prototype, "totalGross", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_net', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollRunEntity.prototype, "totalNet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_tax', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollRunEntity.prototype, "totalTax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PayrollRunEntity.prototype, "employeeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_details', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "errorDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_key', type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "lockKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], PayrollRunEntity.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payslip_entity_1.PayslipEntity, (payslip) => payslip.run),
    __metadata("design:type", Array)
], PayrollRunEntity.prototype, "payslips", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollRunEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayrollRunEntity.prototype, "updatedAt", void 0);
exports.PayrollRunEntity = PayrollRunEntity = __decorate([
    (0, typeorm_1.Entity)('payroll_runs')
], PayrollRunEntity);
//# sourceMappingURL=payroll-run.entity.js.map