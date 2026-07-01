import { Injectable } from '@nestjs/common';
import { TaxStrategyFactory } from './strategies/tax-strategy.factory';
import { TaxConfig, TaxBreakdown } from './interfaces/tax-strategy.interface';

/**
 * TaxService is the public-facing service for tax calculations.
 * It delegates to the appropriate strategy based on the organization's region.
 */
@Injectable()
export class TaxService {
  constructor(private readonly strategyFactory: TaxStrategyFactory) {}

  /**
   * Calculate tax for a given amount using the strategy determined by the config region.
   * @param amount - Taxable amount before tax
   * @param config - Tax configuration including region, state info, exemptions
   * @returns Full tax breakdown with individual components
   */
  calculateTax(amount: number, config: TaxConfig): TaxBreakdown {
    const strategy = this.strategyFactory.getStrategy(config.region);
    return strategy.calculateTax(amount, config);
  }

  /**
   * Calculate tax for multiple line items in bulk.
   * @param items - Array of { amount, config } for each line item
   * @returns Array of tax breakdowns corresponding to each item
   */
  calculateBulkTax(items: Array<{ amount: number; config: TaxConfig }>): TaxBreakdown[] {
    return items.map((item) => this.calculateTax(item.amount, item.config));
  }
}
