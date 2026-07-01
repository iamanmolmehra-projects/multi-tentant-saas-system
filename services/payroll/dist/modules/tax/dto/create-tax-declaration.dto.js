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
exports.CreateTaxDeclarationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTaxDeclarationDto {
}
exports.CreateTaxDeclarationDto = CreateTaxDeclarationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Financial year (e.g., 2024-25)',
        example: '2024-25',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}$/, { message: 'Financial year must be in format YYYY-YY (e.g., 2024-25)' }),
    __metadata("design:type", String)
], CreateTaxDeclarationDto.prototype, "financialYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax regime selection',
        example: 'new',
        enum: ['new', 'old'],
        default: 'new',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['new', 'old']),
    __metadata("design:type", String)
], CreateTaxDeclarationDto.prototype, "regime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax declarations/deductions',
        example: {
            section_80c: 150000,
            section_80d: 25000,
            hra_exemption: 120000,
            home_loan_interest: 200000,
            section_80ccd: 50000,
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTaxDeclarationDto.prototype, "declarations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Declaration status',
        example: 'draft',
        enum: ['draft', 'submitted', 'verified'],
        default: 'draft',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['draft', 'submitted', 'verified']),
    __metadata("design:type", String)
], CreateTaxDeclarationDto.prototype, "status", void 0);
//# sourceMappingURL=create-tax-declaration.dto.js.map