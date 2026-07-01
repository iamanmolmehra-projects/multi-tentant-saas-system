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
exports.PayrollRunsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const payroll_runs_service_1 = require("./payroll-runs.service");
const trigger_payroll_run_dto_1 = require("./dto/trigger-payroll-run.dto");
let PayrollRunsController = class PayrollRunsController {
    constructor(payrollRunsService) {
        this.payrollRunsService = payrollRunsService;
    }
    trigger(orgId, user, dto) {
        return this.payrollRunsService.trigger(orgId, user.userId, dto);
    }
    findAll(orgId) {
        return this.payrollRunsService.findAllByOrg(orgId);
    }
    findOne(id, orgId) {
        return this.payrollRunsService.findById(id, orgId);
    }
    cancel(id, orgId, user) {
        return this.payrollRunsService.cancel(id, orgId, user.userId);
    }
};
exports.PayrollRunsController = PayrollRunsController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Payroll run triggered' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trigger_payroll_run_dto_1.TriggerPayrollRunDto]),
    __metadata("design:returntype", void 0)
], PayrollRunsController.prototype, "trigger", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'List payroll runs for organization' }),
    __param(0, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollRunsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get payroll run by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayrollRunsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Payroll run cancelled' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PayrollRunsController.prototype, "cancel", null);
exports.PayrollRunsController = PayrollRunsController = __decorate([
    (0, swagger_1.ApiTags)('Payroll Runs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'payroll-runs', version: '1' }),
    __metadata("design:paramtypes", [payroll_runs_service_1.PayrollRunsService])
], PayrollRunsController);
//# sourceMappingURL=payroll-runs.controller.js.map