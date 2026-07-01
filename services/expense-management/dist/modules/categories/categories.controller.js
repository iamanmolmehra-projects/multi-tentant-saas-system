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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(orgId, dto) {
        return this.categoriesService.create(orgId, dto);
    }
    findAll(orgId) {
        return this.categoriesService.findAll(orgId);
    }
    findOne(id, orgId) {
        return this.categoriesService.findById(id, orgId);
    }
    update(id, orgId, dto) {
        return this.categoriesService.update(id, orgId, dto);
    }
    delete(id, orgId) {
        return this.categoriesService.delete(id, orgId);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_CREATE),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Category created' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiOkResponse)({ description: 'List all categories' }),
    __param(0, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get category by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_UPDATE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Category updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, shared_1.RequireRoles)(shared_1.RoleEnum.ORG_ADMIN, shared_1.RoleEnum.SUPER_ADMIN),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_DELETE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "delete", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Expense Categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'categories', version: '1' }),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map