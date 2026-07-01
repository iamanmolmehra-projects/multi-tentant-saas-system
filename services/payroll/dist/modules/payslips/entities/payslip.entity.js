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
exports.PayslipEntity = void 0;
const typeorm_1 = require("typeorm");
const payroll_run_entity_1 = require("../../payroll-runs/entities/payroll-run.entity");
let PayslipEntity = class PayslipEntity {
};
exports.PayslipEntity = PayslipEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PayslipEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayslipEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayslipEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'run_id', type: 'uuid' }),
    __metadata("design:type", String)
], PayslipEntity.prototype, "runId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payroll_run_entity_1.PayrollRunEntity, (run) => run.payslips, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'run_id' }),
    __metadata("design:type", payroll_run_entity_1.PayrollRunEntity)
], PayslipEntity.prototype, "run", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_start', type: 'date' }),
    __metadata("design:type", Date)
], PayslipEntity.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_end', type: 'date' }),
    __metadata("design:type", Date)
], PayslipEntity.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gross_salary', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PayslipEntity.prototype, "grossSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_salary', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PayslipEntity.prototype, "netSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], PayslipEntity.prototype, "components", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], PayslipEntity.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayslipEntity.prototype, "reimbursements", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ytd_gross', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayslipEntity.prototype, "ytdGross", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ytd_tax', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayslipEntity.prototype, "ytdTax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pdf_url', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PayslipEntity.prototype, "pdfUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PayslipEntity.prototype, "createdAt", void 0);
exports.PayslipEntity = PayslipEntity = __decorate([
    (0, typeorm_1.Entity)('payslips')
], PayslipEntity);
//# sourceMappingURL=payslip.entity.js.map