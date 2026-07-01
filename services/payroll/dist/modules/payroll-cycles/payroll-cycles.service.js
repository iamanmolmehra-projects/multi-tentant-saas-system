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
exports.PayrollCyclesService = void 0;
const common_1 = require("@nestjs/common");
const payroll_cycle_repository_1 = require("./repositories/payroll-cycle.repository");
let PayrollCyclesService = class PayrollCyclesService {
    constructor(payrollCycleRepository) {
        this.payrollCycleRepository = payrollCycleRepository;
    }
    async create(orgId, dto) {
        return this.payrollCycleRepository.create({
            orgId,
            name: dto.name,
            frequency: dto.frequency,
            payDay: dto.payDay,
            startDate: new Date(dto.startDate),
            endDate: dto.endDate ? new Date(dto.endDate) : null,
            isActive: true,
        });
    }
    async findAllByOrg(orgId) {
        return this.payrollCycleRepository.findAllByOrg(orgId);
    }
    async findById(id, orgId) {
        const cycle = await this.payrollCycleRepository.findById(id, orgId);
        if (!cycle) {
            throw new common_1.NotFoundException(`Payroll cycle ${id} not found`);
        }
        return cycle;
    }
};
exports.PayrollCyclesService = PayrollCyclesService;
exports.PayrollCyclesService = PayrollCyclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_cycle_repository_1.PayrollCycleRepository])
], PayrollCyclesService);
//# sourceMappingURL=payroll-cycles.service.js.map