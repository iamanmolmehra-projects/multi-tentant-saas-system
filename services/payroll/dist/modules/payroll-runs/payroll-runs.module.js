"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payroll_run_entity_1 = require("./entities/payroll-run.entity");
const payroll_run_repository_1 = require("./repositories/payroll-run.repository");
const payroll_runs_service_1 = require("./payroll-runs.service");
const payroll_runs_controller_1 = require("./payroll-runs.controller");
const salary_structures_module_1 = require("../salary-structures/salary-structures.module");
const payroll_cycles_module_1 = require("../payroll-cycles/payroll-cycles.module");
const tax_module_1 = require("../tax/tax.module");
const payslips_module_1 = require("../payslips/payslips.module");
const reimbursements_module_1 = require("../reimbursements/reimbursements.module");
let PayrollRunsModule = class PayrollRunsModule {
};
exports.PayrollRunsModule = PayrollRunsModule;
exports.PayrollRunsModule = PayrollRunsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payroll_run_entity_1.PayrollRunEntity]),
            salary_structures_module_1.SalaryStructuresModule,
            payroll_cycles_module_1.PayrollCyclesModule,
            tax_module_1.TaxModule,
            payslips_module_1.PayslipsModule,
            reimbursements_module_1.ReimbursementsModule,
        ],
        controllers: [payroll_runs_controller_1.PayrollRunsController],
        providers: [payroll_runs_service_1.PayrollRunsService, payroll_run_repository_1.PayrollRunRepository],
        exports: [payroll_runs_service_1.PayrollRunsService, payroll_run_repository_1.PayrollRunRepository],
    })
], PayrollRunsModule);
//# sourceMappingURL=payroll-runs.module.js.map