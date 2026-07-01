import { Injectable } from '@nestjs/common';
import { TaxStrategy, TaxConfig, TaxBreakdown } from '../interfaces/tax-strategy.interface';

/**
 * EU VAT Strategy.
 *
 * Applies standard European Union Value Added Tax:
 * - Single VAT component at the applicable rate
 * - Default rate: 20% (configurable via customRate)
 */
@Injectable()
export class VatEuStrategy implements TaxStrategy {
  private readonly DEFAULT_VAT_RATE = 20;

  calculateTax(amount: number, config: TaxConfig): TaxBreakdown {
    if (config.isExempt) {
      return { totalTax: 0, effectiveRate: 0, components: [] };
    }

    const vatRate = config.customRate ?? this.DEFAULT_VAT_RATE;
    const vatAmount = this.round(amount * (vatRate / 100));

    return {
      totalTax: vatAmount,
      effectiveRate: vatRate,
      components: [{ name: 'VAT', rate: vatRate, amount: vatAmount }],
    };
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
