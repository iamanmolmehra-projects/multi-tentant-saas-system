import { TaxCalculationStrategy } from './tax-calculation.strategy';
export declare class IndiaNewRegimeStrategy implements TaxCalculationStrategy {
    readonly regime = "new";
    calculateAnnualTax(annualTaxableIncome: number, _declarations?: Record<string, unknown>): number;
    calculateMonthlyTds(annualTax: number, monthsRemaining: number): number;
}
