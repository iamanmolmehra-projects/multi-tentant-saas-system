import { Injectable } from '@nestjs/common';
import { TaxCalculationStrategy } from './tax-calculation.strategy';

/**
 * India New Tax Regime (FY 2023-24 onwards).
 * Simplified slabs with no major deductions/exemptions.
 *
 * Slabs:
 * 0 - 3,00,000: Nil
 * 3,00,001 - 6,00,000: 5%
 * 6,00,001 - 9,00,000: 10%
 * 9,00,001 - 12,00,000: 15%
 * 12,00,001 - 15,00,000: 20%
 * Above 15,00,000: 30%
 *
 * Standard deduction: 50,000
 * Rebate u/s 87A: Up to 7,00,000 taxable income = Nil tax
 */
@Injectable()
export class IndiaNewRegimeStrategy implements TaxCalculationStrategy {
  readonly regime = 'new';

  calculateAnnualTax(
    annualTaxableIncome: number,
    _declarations?: Record<string, unknown>,
  ): number {
    // Standard deduction under new regime
    const standardDeduction = 50000;
    const taxableIncome = Math.max(0, annualTaxableIncome - standardDeduction);

    // Rebate u/s 87A
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

      if (remaining <= 0) break;
    }

    // Add 4% health and education cess
    tax = tax * 1.04;

    return Math.round(tax);
  }

  calculateMonthlyTds(annualTax: number, monthsRemaining: number): number {
    if (monthsRemaining <= 0) return 0;
    return Math.round(annualTax / monthsRemaining);
  }
}
