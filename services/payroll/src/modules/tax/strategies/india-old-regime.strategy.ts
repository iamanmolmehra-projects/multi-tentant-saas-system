import { Injectable } from '@nestjs/common';
import { TaxCalculationStrategy } from './tax-calculation.strategy';

/**
 * India Old Tax Regime.
 * Allows deductions under various sections (80C, 80D, HRA, etc.).
 *
 * Slabs:
 * 0 - 2,50,000: Nil
 * 2,50,001 - 5,00,000: 5%
 * 5,00,001 - 10,00,000: 20%
 * Above 10,00,000: 30%
 *
 * Standard deduction: 50,000
 * Rebate u/s 87A: Up to 5,00,000 taxable income = Nil tax
 */
@Injectable()
export class IndiaOldRegimeStrategy implements TaxCalculationStrategy {
  readonly regime = 'old';

  calculateAnnualTax(
    annualTaxableIncome: number,
    declarations?: Record<string, unknown>,
  ): number {
    // Standard deduction
    const standardDeduction = 50000;
    let taxableIncome = Math.max(0, annualTaxableIncome - standardDeduction);

    // Apply declarations/deductions
    if (declarations) {
      const section80C = Math.min(Number(declarations['section_80c'] || 0), 150000);
      const section80D = Math.min(Number(declarations['section_80d'] || 0), 75000);
      const hra = Number(declarations['hra_exemption'] || 0);
      const homeLoanInterest = Math.min(Number(declarations['home_loan_interest'] || 0), 200000);
      const nps80CCD = Math.min(Number(declarations['section_80ccd'] || 0), 50000);

      const totalDeductions = section80C + section80D + hra + homeLoanInterest + nps80CCD;
      taxableIncome = Math.max(0, taxableIncome - totalDeductions);
    }

    // Rebate u/s 87A
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
