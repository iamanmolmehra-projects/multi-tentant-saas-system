import { TaxCalculationStrategy } from './tax-calculation.strategy';
export declare class IndiaOldRegimeStrategy implements TaxCalculationStrategy {
    readonly regime = "old";
    calculateAnnualTax(annualTaxableIncome: number, declarations?: Record<string, unknown>): number;
    calculateMonthlyTds(annualTax: number, monthsRemaining: number): number;
}
