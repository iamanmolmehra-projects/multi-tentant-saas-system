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
exports.SalaryStructuresService = void 0;
const common_1 = require("@nestjs/common");
const salary_structure_repository_1 = require("./repositories/salary-structure.repository");
let SalaryStructuresService = class SalaryStructuresService {
    constructor(salaryStructureRepository) {
        this.salaryStructureRepository = salaryStructureRepository;
    }
    async create(orgId, dto) {
        const effectiveFrom = new Date(dto.effectiveFrom);
        const previousDay = new Date(effectiveFrom);
        previousDay.setDate(previousDay.getDate() - 1);
        await this.salaryStructureRepository.markPreviousAsInactive(orgId, dto.userId, previousDay);
        return this.salaryStructureRepository.create({
            orgId,
            userId: dto.userId,
            baseSalary: dto.baseSalary,
            currency: dto.currency || 'INR',
            components: dto.components,
            deductions: dto.deductions || {},
            effectiveFrom,
            effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
            isCurrent: true,
        });
    }
    async findCurrentByUser(orgId, userId) {
        const structure = await this.salaryStructureRepository.findCurrentByUser(orgId, userId);
        if (!structure) {
            throw new common_1.NotFoundException(`No active salary structure found for user ${userId}`);
        }
        return structure;
    }
    async findHistoryByUser(orgId, userId) {
        return this.salaryStructureRepository.findHistoryByUser(orgId, userId);
    }
    async findAllCurrentByOrg(orgId) {
        return this.salaryStructureRepository.findAllCurrentByOrg(orgId);
    }
};
exports.SalaryStructuresService = SalaryStructuresService;
exports.SalaryStructuresService = SalaryStructuresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [salary_structure_repository_1.SalaryStructureRepository])
], SalaryStructuresService);
//# sourceMappingURL=salary-structures.service.js.map