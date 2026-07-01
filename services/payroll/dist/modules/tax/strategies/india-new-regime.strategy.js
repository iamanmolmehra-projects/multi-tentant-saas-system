"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndiaNewRegimeStrategy = void 0;
const common_1 = require("@nestjs/common");
let IndiaNewRegimeStrategy = class IndiaNewRegimeStrategy {
    constructor() {
        this.regime = 'new';
    }
    calculateAnnualTax(annualTaxableIncome, _declarations) {
        const standardDeduction = 50000;
        const taxableIncome = Math.max(0, annualTaxableIncome - standardDeduction);
        if (taxableIncome <= 700000) {
            return 0;
        }
        let tax = 0;
        const slabs = [
            { limit: 300000, rate: 0 },
            { limit: 600000, rate: 0.05 },
            { limit: 900000, rate: 0.10 },
            { limit: 1200000, rate: 0.15 },
            { limit: 1500000, rate: 0.20 },
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
exports.IndiaNewRegimeStrategy = IndiaNewRegimeStrategy;
exports.IndiaNewRegimeStrategy = IndiaNewRegimeStrategy = __decorate([
    (0, common_1.Injectable)()
], IndiaNewRegimeStrategy);
//# sourceMappingURL=india-new-regime.strategy.js.map