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
exports.PayslipsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const payslips_service_1 = require("./payslips.service");
let PayslipsController = class PayslipsController {
    constructor(payslipsService) {
        this.payslipsService = payslipsService;
    }
    findAll(orgId, user, page, limit) {
        return this.payslipsService.findByUser(orgId, user.userId, page, limit);
    }
    findOne(id, orgId) {
        return this.payslipsService.findById(id, orgId);
    }
    getPdf(id, orgId) {
        return this.payslipsService.getPdfUrl(id, orgId);
    }
};
exports.PayslipsController = PayslipsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'List payslips for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PayslipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get payslip by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayslipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get payslip PDF URL' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayslipsController.prototype, "getPdf", null);
exports.PayslipsController = PayslipsController = __decorate([
    (0, swagger_1.ApiTags)('Payslips'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'payslips', version: '1' }),
    __metadata("design:paramtypes", [payslips_service_1.PayslipsService])
], PayslipsController);
//# sourceMappingURL=payslips.controller.js.map