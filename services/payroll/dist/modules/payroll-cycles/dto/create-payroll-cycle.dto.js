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
exports.CreatePayrollCycleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePayrollCycleDto {
}
exports.CreatePayrollCycleDto = CreatePayrollCycleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payroll cycle name', example: 'Monthly Payroll' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePayrollCycleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment frequency',
        example: 'monthly',
        enum: ['weekly', 'biweekly', 'monthly'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['weekly', 'biweekly', 'monthly']),
    __metadata("design:type", String)
], CreatePayrollCycleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of the month for payment (1-31)', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], CreatePayrollCycleDto.prototype, "payDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cycle start date', example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePayrollCycleDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cycle end date', example: '2024-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePayrollCycleDto.prototype, "endDate", void 0);
//# sourceMappingURL=create-payroll-cycle.dto.js.map