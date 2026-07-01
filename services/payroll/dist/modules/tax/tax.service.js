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
var TaxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tax_declaration_entity_1 = require("./entities/tax-declaration.entity");
const india_new_regime_strategy_1 = require("./strategies/india-new-regime.strategy");
const india_old_regime_strategy_1 = require("./strategies/india-old-regime.strategy");
let TaxService = TaxService_1 = class TaxService {
    constructor(taxDeclarationRepo, indiaNewRegime, indiaOldRegime) {
        this.taxDeclarationRepo = taxDeclarationRepo;
        this.indiaNewRegime = indiaNewRegime;
        this.indiaOldRegime = indiaOldRegime;
        this.logger = new common_1.Logger(TaxService_1.name);
        this.strategies = new Map();
        this.strategies.set(indiaNewRegime.regime, indiaNewRegime);
        this.strategies.set(indiaOldRegime.regime, indiaOldRegime);
    }
    async calculateTax(orgId, userId, monthlyGross) {
        const financialYear = this.getCurrentFinancialYear();
        const declaration = await this.taxDeclarationRepo.findOne({
            where: { orgId, userId, financialYear },
        });
        const regime = declaration?.regime || 'new';
        const strategy = this.getStrategy(regime);
        const annualGross = monthlyGross * 12;
        const annualTax = strategy.calculateAnnualTax(annualGross, declaration?.declarations);
        const monthsRemaining = this.getMonthsRemainingInFy();
        const monthlyTds = strategy.calculateMonthlyTds(annualTax, monthsRemaining);
        return monthlyTds;
    }
    getStrategy(regime) {
        const strategy = this.strategies.get(regime);
        if (!strategy) {
            this.logger.warn(`Unknown tax regime: ${regime}, falling back to new regime`);
            return this.strategies.get('new');
        }
        return strategy;
    }
    async createDeclaration(orgId, userId, dto) {
        const existing = await this.taxDeclarationRepo.findOne({
            where: { orgId, userId, financialYear: dto.financialYear },
        });
        if (existing) {
            existing.regime = dto.regime || 'new';
            existing.declarations = dto.declarations;
            existing.status = dto.status || 'draft';
            return this.taxDeclarationRepo.save(existing);
        }
        return this.taxDeclarationRepo.save(this.taxDeclarationRepo.create({
            orgId,
            userId,
            financialYear: dto.financialYear,
            regime: dto.regime || 'new',
            declarations: dto.declarations,
            status: dto.status || 'draft',
        }));
    }
    async findDeclaration(orgId, userId, financialYear) {
        const declaration = await this.taxDeclarationRepo.findOne({
            where: { orgId, userId, financialYear },
        });
        if (!declaration) {
            throw new common_1.NotFoundException(`Tax declaration not found for user ${userId} in FY ${financialYear}`);
        }
        return declaration;
    }
    async findDeclarationsByUser(orgId, userId) {
        return this.taxDeclarationRepo.find({
            where: { orgId, userId },
            order: { financialYear: 'DESC' },
        });
    }
    getCurrentFinancialYear() {
        const now = new Date();
        const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        return `${year}-${(year + 1).toString().slice(2)}`;
    }
    getMonthsRemainingInFy() {
        const now = new Date();
        const month = now.getMonth();
        if (month >= 3) {
            return 12 - (month - 3);
        }
        return 3 - month;
    }
};
exports.TaxService = TaxService;
exports.TaxService = TaxService = TaxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tax_declaration_entity_1.TaxDeclarationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        india_new_regime_strategy_1.IndiaNewRegimeStrategy,
        india_old_regime_strategy_1.IndiaOldRegimeStrategy])
], TaxService);
//# sourceMappingURL=tax.service.js.map