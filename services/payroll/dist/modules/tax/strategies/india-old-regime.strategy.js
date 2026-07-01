"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndiaOldRegimeStrategy = void 0;
const common_1 = require("@nestjs/common");
let IndiaOldRegimeStrategy = class IndiaOldRegimeStrategy {
    constructor() {
        this.regime = 'old';
    }
    calculateAnnualTax(annualTaxableIncome, declarations) {
        const standardDeduction = 50000;
        let taxableIncome = Math.max(0, annualTaxableIncome - standardDeduction);
        if (declarations) {
            const section80C = Math.min(Number(declarations['section_80c'] || 0), 150000);
            const section80D = Math.min(Number(declarations['section_80d'] || 0), 75000);
            const hra = Number(declarations['hra_exemption'] || 0);
            const homeLoanInterest = Math.min(Number(declarations['home_loan_interest'] || 0), 200000);
            const nps80CCD = Math.min(Number(declarations['section_80ccd'] || 0), 50000);
            const totalDeductions = section80C + section80D + hra + homeLoanInterest + nps80CCD;
            taxableIncome = Math.max(0, taxableIncome - totalDeductions);
        }
        if (taxableIncome <= 500000) {
            return 0;
        }
        let tax = 0;
        const slabs = [
            { limit: 250000, rate: 0 },
            { limit: 500000, rate: 0.05 },
            { limit: 1000000, rate: 0.20 },
            { limit: Infinity, rate: 0.30 },
        ];
        let remaining = taxableIncome;
        let previousLimit = 0;
        for (const slab of slabs) {
            const slabWidth = slab.limit - previousLimit;
            const amountInSlab = Math.min(remaining, slabWidth);
            tax += amountInSlab * slab.rate;
            remaining -= amountInSlab;
            previousLimit = slab.limit;
            if (remaining <= 0)
                break;
        }
        tax = tax * 1.04;
        return Math.round(tax);
    }
    calculateMonthlyTds(annualTax, monthsRemaining) {
        if (monthsRemaining <= 0)
            return 0;
        return Math.round(annualTax / monthsRemaining);
    }
};
exports.IndiaOldRegimeStrategy = IndiaOldRegimeStrategy;
exports.IndiaOldRegimeStrategy = IndiaOldRegimeStrategy = __decorate([
    (0, common_1.Injectable)()
], IndiaOldRegimeStrategy);
//# sourceMappingURL=india-old-regime.strategy.js.map