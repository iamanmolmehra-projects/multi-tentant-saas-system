import { Injectable } from '@nestjs/common';
import { TaxStrategy, TaxConfig, TaxBreakdown } from '../interfaces/tax-strategy.interface';

/**
 * No Tax Strategy.
 *
 * Used for tax-exempt organizations or jurisdictions where no tax applies.
 * Always returns zero tax regardless of configuration.
 */
@Injectable()
export class NoTaxStrategy implements TaxStrategy {
  calculateTax(_amount: number, _config: TaxConfig): TaxBreakdown {
    return {
      totalTax: 0,
      effectiveRate: 0,
      components: [],
    };
  }
}
