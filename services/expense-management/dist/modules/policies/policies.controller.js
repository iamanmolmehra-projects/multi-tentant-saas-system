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
exports.PoliciesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@multi-tenant/shared");
const policies_service_1 = require("./policies.service");
class CreatePolicyDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Travel Expense Limit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'uuid-of-role' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 50000.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'monthly', description: 'daily | weekly | monthly | quarterly | yearly' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "period", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 500.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "requiresReceiptAbove", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 200.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "autoApproveBelow", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyDto.prototype, "isActive", void 0);
let PoliciesController = class PoliciesController {
    constructor(policiesService) {
        this.policiesService = policiesService;
    }
    create(orgId, dto) {
        return this.policiesService.create(orgId, {
            name: dto.name,
            categoryId: dto.categoryId || null,
            roleId: dto.roleId || null,
            maxAmount: dto.maxAmount ?? null,
            currency: dto.currency || 'INR',
            period: dto.period || null,
            requiresReceiptAbove: dto.requiresReceiptAbove ?? null,
            autoApproveBelow: dto.autoApproveBelow ?? null,
            isActive: dto.isActive ?? true,
        });
    }
    findAll(orgId) {
        return this.policiesService.findAll(orgId);
    }
    findOne(id, orgId) {
        return this.policiesService.findById(id, orgId);
    }
    update(id, orgId, dto) {
        return this.policiesService.update(id, orgId, dto);
    }
    delete(id, orgId) {
        return this.policiesService.delete(id, orgId);
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_CREATE),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Policy created' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreatePolicyDto]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiOkResponse)({ description: 'List all policies' }),
    __param(0, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get policy by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_UPDATE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Policy updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_DELETE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Policy deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "delete", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('Expense Policies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'policies', version: '1' }),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map