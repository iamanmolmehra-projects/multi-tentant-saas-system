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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCyclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const payroll_cycles_service_1 = require("./payroll-cycles.service");
const create_payroll_cycle_dto_1 = require("./dto/create-payroll-cycle.dto");
let PayrollCyclesController = class PayrollCyclesController {
    constructor(payrollCyclesService) {
        this.payrollCyclesService = payrollCyclesService;
    }
    create(orgId, dto) {
        return this.payrollCyclesService.create(orgId, dto);
    }
    findAll(orgId) {
        return this.payrollCyclesService.findAllByOrg(orgId);
    }
};
exports.PayrollCyclesController = PayrollCyclesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Payroll cycle created' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_payroll_cycle_dto_1.CreatePayrollCycleDto]),
    __metadata("design:returntype", void 0)
], PayrollCyclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'List payroll cycles for organization' }),
    __param(0, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollCyclesController.prototype, "findAll", null);
exports.PayrollCyclesController = PayrollCyclesController = __decorate([
    (0, swagger_1.ApiTags)('Payroll Cycles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'payroll-cycles', version: '1' }),
    __metadata("design:paramtypes", [payroll_cycles_service_1.PayrollCyclesService])
], PayrollCyclesController);
//# sourceMappingURL=payroll-cycles.controller.js.map