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
exports.CreateSalaryStructureDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSalaryStructureDto {
}
exports.CreateSalaryStructureDto = CreateSalaryStructureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID for the salary structure', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalaryStructureDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base salary amount', example: 50000 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryStructureDto.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateSalaryStructureDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Salary components breakdown (e.g., HRA, DA, special allowance)',
        example: { hra: 20000, da: 10000, special_allowance: 5000 },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSalaryStructureDto.prototype, "components", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deductions (e.g., PF, ESI)',
        example: { pf: 1800, esi: 500 },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSalaryStructureDto.prototype, "deductions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date', example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSalaryStructureDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective to date (null for current)', example: '2024-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSalaryStructureDto.prototype, "effectiveTo", void 0);
//# sourceMappingURL=create-salary-structure.dto.js.map