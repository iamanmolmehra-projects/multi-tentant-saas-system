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
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const query_expenses_dto_1 = require("./dto/query-expenses.dto");
let ExpensesController = class ExpensesController {
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(orgId, user, dto) {
        return this.expensesService.create(orgId, user.userId, user.roleId, dto);
    }
    findAll(orgId, user, query) {
        return this.expensesService.findAll(orgId, user.userId, query);
    }
    findAllForOrg(orgId, query) {
        return this.expensesService.findAllForOrg(orgId, query);
    }
    findOne(id, orgId) {
        return this.expensesService.findById(id, orgId);
    }
    update(id, orgId, user, dto) {
        return this.expensesService.update(id, orgId, user.userId, dto);
    }
    delete(id, orgId, user) {
        return this.expensesService.delete(id, orgId, user.userId);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_CREATE),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Expense created' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiOkResponse)({ description: 'List expenses for current user' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, query_expenses_dto_1.QueryExpensesDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('org'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_APPROVE),
    (0, swagger_1.ApiOkResponse)({ description: 'List all expenses in the organization (manager/admin)' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_expenses_dto_1.QueryExpensesDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAllForOrg", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_READ),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get expense by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_UPDATE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiOkResponse)({ description: 'Expense updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, shared_1.RequirePermissions)(shared_1.PermissionEnum.EXPENSE_DELETE),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Expense deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "delete", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('Expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'expenses', version: '1' }),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map