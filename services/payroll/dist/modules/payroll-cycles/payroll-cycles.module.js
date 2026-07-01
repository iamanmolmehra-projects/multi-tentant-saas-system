"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCyclesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payroll_cycle_entity_1 = require("./entities/payroll-cycle.entity");
const payroll_cycle_repository_1 = require("./repositories/payroll-cycle.repository");
const payroll_cycles_service_1 = require("./payroll-cycles.service");
const payroll_cycles_controller_1 = require("./payroll-cycles.controller");
let PayrollCyclesModule = class PayrollCyclesModule {
};
exports.PayrollCyclesModule = PayrollCyclesModule;
exports.PayrollCyclesModule = PayrollCyclesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payroll_cycle_entity_1.PayrollCycleEntity])],
        controllers: [payroll_cycles_controller_1.PayrollCyclesController],
        providers: [payroll_cycles_service_1.PayrollCyclesService, payroll_cycle_repository_1.PayrollCycleRepository],
        exports: [payroll_cycles_service_1.PayrollCyclesService, payroll_cycle_repository_1.PayrollCycleRepository],
    })
], PayrollCyclesModule);
//# sourceMappingURL=payroll-cycles.module.js.map