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
exports.CreateExpenseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateExpenseDto {
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Flight to Mumbai' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Round trip flight for client meeting' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4500.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "expenseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-report' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IndiGo Airlines' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.example.com/receipts/abc.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "receiptUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { fileSize: 1024, mimeType: 'application/pdf' } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateExpenseDto.prototype, "receiptMetadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'req_abc123',
        description: 'Client-generated idempotency key to prevent duplicate submissions',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "idempotencyKey", void 0);
//# sourceMappingURL=create-expense.dto.js.map