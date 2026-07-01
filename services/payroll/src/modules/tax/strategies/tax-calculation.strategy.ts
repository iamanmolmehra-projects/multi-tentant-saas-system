/**
 * Strategy interface for tax calculation.
 * Different implementations can be provided for different tax regimes.
 */
export interface TaxCalculationStrategy {
  /**
   * Unique identifier for the strategy (e.g., 'india_new', 'india_old')
   */
  readonly regime: string;

  /**
   * Calculates annual tax based on taxable income.
   * @param annualTaxableIncome - Annual gross taxable income
   * @param declarations - Tax declarations/deductions claimed by the employee
   * @returns Annual tax amount
   */
  calculateAnnualTax(
    annualTaxableIncome: number,
    declarations?: Record<string, unknown>,
  ): number;

  /**
   * Calculates monthly TDS (Tax Deducted at Source).
   * @param annualTax - Total annual tax
   * @param monthsRemaining - Months remaining in financial year
   * @returns Monthly tax deduction amount
   */
  calculateMonthlyTds(annualTax: number, monthsRemaining: number): number;
}
