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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@multi-tenant/shared");
const reports_service_1 = require("./reports.service");
const create_report_dto_1 = require("./dto/create-report.dto");
class QueryReportsDto extends shared_1.PaginationQueryDto {
}
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'submitted' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "status", void 0);
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    create(orgId, user, dto) {
        return this.reportsService.create(orgId, user.userId, dto);
    }
    findAll(orgId, user, query) {
        return this.reportsService.findAll(orgId, user.userId, query);
    }
    findAllForOrg(orgId, query) {
        return this.reportsService.findAllForOrg(orgId, query);
    }
    findOne(id, orgId) {
        return this.reportsService.findById(id, orgId);
    }
    submit(id, orgId, user) {
        return this.reportsService.submit(id, orgId, user.userId);
    }
    approve(id, orgId, user) {
        return this.reportsService.approve(id, orgId, user.userId);
    }
    reject(id, orgId, user) {
        return this.reportsService.reject(id, orgId, user.userId);
    }
    delete(id, orgId, user) {
        return this.reportsService.delete(id, orgId, user.userId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_CREATE),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Report created' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiOkResponse)({ description: 'List reports for current user' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, QueryReportsDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('org'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_APPROVE),
    (0, swagger_1.ApiOkResponse)({ description: 'List all reports in the organization (manager/admin)' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, QueryReportsDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAllForOrg", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get report by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_CREATE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Report submitted for approval' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_APPROVE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Report approved' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_APPROVE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Report rejected' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_DELETE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Report deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "delete", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Expense Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'reports', version: '1' }),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map