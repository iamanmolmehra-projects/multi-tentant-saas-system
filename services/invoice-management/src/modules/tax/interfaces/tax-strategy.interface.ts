/**
 * Tax calculation configuration passed to a strategy.
 */
export interface TaxConfig {
  /** Region or country code (e.g., 'IN', 'EU', 'US') */
  region: string;
  /** State/province of the seller */
  sellerState?: string;
  /** State/province of the buyer */
  buyerState?: string;
  /** HSN/SAC code for item-level tax lookup */
  hsnCode?: string;
  /** Whether the entity is tax-exempt */
  isExempt?: boolean;
  /** Custom tax rate override (percentage) */
  customRate?: number;
}

/**
 * Breakdown of tax components returned by a strategy.
 */
export interface TaxBreakdown {
  /** Total tax amount */
  totalTax: number;
  /** Effective tax rate applied */
  effectiveRate: number;
  /** Individual tax components */
  components: TaxComponent[];
}

export interface TaxComponent {
  /** Name of the tax (e.g., 'CGST', 'SGST', 'IGST', 'VAT') */
  name: string;
  /** Tax rate percentage for this component */
  rate: number;
  /** Calculated amount for this component */
  amount: number;
}

/**
 * Strategy interface for tax calculation.
 * Each implementation handles tax rules for a specific jurisdiction.
 */
export interface TaxStrategy {
  /**
   * Calculate tax for a given amount based on the provided configuration.
   * @param amount - The taxable amount before tax
   * @param config - Tax configuration including region and state info
   * @returns Tax breakdown with components
   */
  calculateTax(amount: number, config: TaxConfig): TaxBreakdown;
}
