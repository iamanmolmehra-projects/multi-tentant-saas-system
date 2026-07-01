export interface TaxCalculationStrategy {
    readonly regime: string;
    calculateAnnualTax(annualTaxableIncome: number, declarations?: Record<string, unknown>): number;
    calculateMonthlyTds(annualTax: number, monthsRemaining: number): number;
}
