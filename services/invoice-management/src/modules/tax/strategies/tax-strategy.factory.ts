import { Injectable } from '@nestjs/common';
import { TaxStrategy } from '../interfaces/tax-strategy.interface';
import { GstIndiaStrategy } from './gst-india.strategy';
import { VatEuStrategy } from './vat-eu.strategy';
import { NoTaxStrategy } from './no-tax.strategy';

/**
 * Factory that selects the appropriate TaxStrategy based on an organization's region config.
 *
 * Strategy selection:
 * - 'IN' → GstIndiaStrategy (CGST+SGST or IGST)
 * - 'EU' → VatEuStrategy (standard VAT)
 * - Any other or 'NONE' → NoTaxStrategy (tax-exempt)
 */
@Injectable()
export class TaxStrategyFactory {
  constructor(
    private readonly gstIndiaStrategy: GstIndiaStrategy,
    private readonly vatEuStrategy: VatEuStrategy,
    private readonly noTaxStrategy: NoTaxStrategy,
  ) {}

  /**
   * Returns the appropriate tax strategy for the given region.
   * @param region - Organization's tax region code (e.g., 'IN', 'EU', 'NONE')
   */
  getStrategy(region: string): TaxStrategy {
    switch (region?.toUpperCase()) {
      case 'IN':
      case 'INDIA':
        return this.gstIndiaStrategy;

      case 'EU':
      case 'EUROPE':
        return this.vatEuStrategy;

      case 'NONE':
      case 'EXEMPT':
      default:
        return this.noTaxStrategy;
    }
  }
}
