import { Injectable } from '@nestjs/common';
import { TaxStrategy, TaxConfig, TaxBreakdown } from '../interfaces/tax-strategy.interface';

/**
 * GST India Strategy.
 *
 * Applies Indian Goods and Services Tax rules:
 * - Intra-state (seller and buyer in same state): CGST + SGST (split 50/50)
 * - Inter-state (different states): IGST (full rate)
 *
 * Default GST rate is 18% (configurable via customRate).
 */
@Injectable()
export class GstIndiaStrategy implements TaxStrategy {
  private readonly DEFAULT_GST_RATE = 18;

  calculateTax(amount: number, config: TaxConfig): TaxBreakdown {
    if (config.isExempt) {
      return { totalTax: 0, effectiveRate: 0, components: [] };
    }

    const gstRate = config.customRate ?? this.DEFAULT_GST_RATE;
    const isIntraState = config.sellerState === config.buyerState;

    if (isIntraState) {
      // Intra-state: split into CGST and SGST
      const halfRate = gstRate / 2;
      const cgstAmount = this.round(amount * (halfRate / 100));
      const sgstAmount = this.round(amount * (halfRate / 100));

      return {
        totalTax: cgstAmount + sgstAmount,
        effectiveRate: gstRate,
        components: [
          { name: 'CGST', rate: halfRate, amount: cgstAmount },
          { name: 'SGST', rate: halfRate, amount: sgstAmount },
        ],
      };
    }

    // Inter-state: full IGST
    const igstAmount = this.round(amount * (gstRate / 100));

    return {
      totalTax: igstAmount,
      effectiveRate: gstRate,
      components: [{ name: 'IGST', rate: gstRate, amount: igstAmount }],
    };
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
