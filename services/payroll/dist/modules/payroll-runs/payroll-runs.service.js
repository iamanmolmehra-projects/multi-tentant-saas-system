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
var PayrollRunsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunsService = void 0;
const common_1 = require("@nestjs/common");
const payroll_run_repository_1 = require("./repositories/payroll-run.repository");
const salary_structures_service_1 = require("../salary-structures/salary-structures.service");
const payroll_cycles_service_1 = require("../payroll-cycles/payroll-cycles.service");
const tax_service_1 = require("../tax/tax.service");
const payslips_service_1 = require("../payslips/payslips.service");
const reimbursements_service_1 = require("../reimbursements/reimbursements.service");
let PayrollRunsService = PayrollRunsService_1 = class PayrollRunsService {
    constructor(payrollRunRepository, salaryStructuresService, payrollCyclesService, taxService, payslipsService, reimbursementsService) {
        this.payrollRunRepository = payrollRunRepository;
        this.salaryStructuresService = salaryStructuresService;
        this.payrollCyclesService = payrollCyclesService;
        this.taxService = taxService;
        this.payslipsService = payslipsService;
        this.reimbursementsService = reimbursementsService;
        this.logger = new common_1.Logger(PayrollRunsService_1.name);
    }
    async trigger(orgId, processedBy, dto) {
        if (dto.idempotencyKey) {
            const existing = await this.payrollRunRepository.findByIdempotencyKey(dto.idempotencyKey);
            if (existing) {
                this.logger.log(`Returning existing run for idempotency key: ${dto.idempotencyKey}`);
                return existing;
            }
        }
        await this.payrollCyclesService.findById(dto.cycleId, orgId);
        const idempotencyKey = dto.idempotencyKey || `run-${orgId}-${dto.cycleId}-${dto.periodStart}`;
        const run = await this.payrollRunRepository.create({
            orgId,
            cycleId: dto.cycleId,
            periodStart: new Date(dto.periodStart),
            periodEnd: new Date(dto.periodEnd),
            status: 'pending',
            processedBy,
            idempotencyKey,
        });
        const lockKey = `lock-${orgId}-${dto.cycleId}-${dto.periodStart}-${dto.periodEnd}`;
        const lockAcquired = await this.payrollRunRepository.acquireLock(lockKey, run.id);
        if (!lockAcquired) {
            await this.payrollRunRepository.updateStatus(run.id, 'failed', {
                errorDetails: { message: 'Could not acquire lock. Another run may be in progress.' },
            });
            throw new common_1.ConflictException('Another payroll run is already in progress for this period');
        }
        try {
            await this.payrollRunRepository.updateStatus(run.id, 'processing', {
                startedAt: new Date(),
            });
            const salaryStructures = await this.salaryStructuresService.findAllCurrentByOrg(orgId);
            let totalGross = 0;
            let totalNet = 0;
            let totalTax = 0;
            let employeeCount = 0;
            for (const salary of salaryStructures) {
                const componentTotal = Object.values(salary.components).reduce((sum, val) => sum + val, 0);
                const grossSalary = Number(salary.baseSalary) + componentTotal;
                const taxAmount = await this.taxService.calculateTax(orgId, salary.userId, grossSalary);
                const deductionTotal = Object.values(salary.deductions).reduce((sum, val) => sum + val, 0);
                const reimbursementAmount = await this.reimbursementsService.getPendingTotal(orgId, salary.userId);
                const netSalary = grossSalary - taxAmount - deductionTotal + reimbursementAmount;
                await this.payslipsService.create({
                    orgId,
                    userId: salary.userId,
                    runId: run.id,
                    periodStart: new Date(dto.periodStart),
                    periodEnd: new Date(dto.periodEnd),
                    grossSalary,
                    netSalary,
                    components: salary.components,
                    deductions: { ...salary.deductions, tax: taxAmount },
                    reimbursements: reimbursementAmount,
                });
                await this.reimbursementsService.markAsIncluded(orgId, salary.userId, run.id);
                totalGross += grossSalary;
                totalNet += netSalary;
                totalTax += taxAmount;
                employeeCount++;
            }
            await this.payrollRunRepository.updateStatus(run.id, 'completed', {
                totalGross,
                totalNet,
                totalTax,
                employeeCount,
                completedAt: new Date(),
            });
            this.logger.log(`Payroll run ${run.id} completed: ${employeeCount} employees processed`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.payrollRunRepository.updateStatus(run.id, 'failed', {
                errorDetails: { message: errorMessage, timestamp: new Date().toISOString() },
            });
            this.logger.error(`Payroll run ${run.id} failed: ${errorMessage}`);
            throw error;
        }
        finally {
            await this.payrollRunRepository.releaseLock(run.id);
        }
        return this.payrollRunRepository.findById(run.id, orgId);
    }
    async findAllByOrg(orgId) {
        return this.payrollRunRepository.findAllByOrg(orgId);
    }
    async findById(id, orgId) {
        const run = await this.payrollRunRepository.findById(id, orgId);
        if (!run) {
            throw new common_1.NotFoundException(`Payroll run ${id} not found`);
        }
        return run;
    }
    async cancel(id, orgId, userId) {
        const run = await this.findById(id, orgId);
        if (!['pending', 'processing'].includes(run.status)) {
            throw new common_1.ConflictException(`Cannot cancel a payroll run with status: ${run.status}`);
        }
        await this.payrollRunRepository.updateStatus(id, 'cancelled', {
            completedAt: new Date(),
            errorDetails: { cancelledBy: userId, timestamp: new Date().toISOString() },
        });
        return this.findById(id, orgId);
    }
};
exports.PayrollRunsService = PayrollRunsService;
exports.PayrollRunsService = PayrollRunsService = PayrollRunsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_run_repository_1.PayrollRunRepository,
        salary_structures_service_1.SalaryStructuresService,
        payroll_cycles_service_1.PayrollCyclesService,
        tax_service_1.TaxService,
        payslips_service_1.PayslipsService,
        reimbursements_service_1.ReimbursementsService])
], PayrollRunsService);
//# sourceMappingURL=payroll-runs.service.js.map