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
exports.TaxDeclarationEntity = void 0;
const typeorm_1 = require("typeorm");
let TaxDeclarationEntity = class TaxDeclarationEntity {
};
exports.TaxDeclarationEntity = TaxDeclarationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'uuid' }),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'financial_year', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "financialYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'new' }),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "regime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], TaxDeclarationEntity.prototype, "declarations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'draft' }),
    __metadata("design:type", String)
], TaxDeclarationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TaxDeclarationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TaxDeclarationEntity.prototype, "updatedAt", void 0);
exports.TaxDeclarationEntity = TaxDeclarationEntity = __decorate([
    (0, typeorm_1.Entity)('tax_declarations')
], TaxDeclarationEntity);
//# sourceMappingURL=tax-declaration.entity.js.map