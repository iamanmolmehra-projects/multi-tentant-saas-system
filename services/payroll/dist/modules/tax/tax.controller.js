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
exports.TaxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@multi-tenant/shared");
const tax_service_1 = require("./tax.service");
const create_tax_declaration_dto_1 = require("./dto/create-tax-declaration.dto");
let TaxController = class TaxController {
    constructor(taxService) {
        this.taxService = taxService;
    }
    createDeclaration(orgId, user, dto) {
        return this.taxService.createDeclaration(orgId, user.userId, dto);
    }
    findMyDeclarations(orgId, user) {
        return this.taxService.findDeclarationsByUser(orgId, user.userId);
    }
    findDeclaration(financialYear, orgId, user) {
        return this.taxService.findDeclaration(orgId, user.userId, financialYear);
    }
};
exports.TaxController = TaxController;
__decorate([
    (0, common_1.Post)('declarations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Tax declaration created/updated' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_tax_declaration_dto_1.CreateTaxDeclarationDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "createDeclaration", null);
__decorate([
    (0, common_1.Get)('declarations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'List tax declarations for current user' }),
    __param(0, (0, shared_1.OrgId)()),
    __param(1, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "findMyDeclarations", null);
__decorate([
    (0, common_1.Get)('declarations/:financialYear'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'financialYear', type: String, example: '2024-25' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get tax declaration for a financial year' }),
    __param(0, (0, common_1.Param)('financialYear')),
    __param(1, (0, shared_1.OrgId)()),
    __param(2, (0, shared_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "findDeclaration", null);
exports.TaxController = TaxController = __decorate([
    (0, swagger_1.ApiTags)('Tax'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(shared_1.TenantIsolationGuard, shared_1.RolesGuard, shared_1.PermissionsGuard),
    (0, common_1.Controller)({ path: 'tax', version: '1' }),
    __metadata("design:paramtypes", [tax_service_1.TaxService])
], TaxController);
//# sourceMappingURL=tax.controller.js.map