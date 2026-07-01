import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxStrategyFactory } from './strategies/tax-strategy.factory';
import { GstIndiaStrategy } from './strategies/gst-india.strategy';
import { VatEuStrategy } from './strategies/vat-eu.strategy';
import { NoTaxStrategy } from './strategies/no-tax.strategy';

@Module({
  providers: [
    TaxService,
    TaxStrategyFactory,
    GstIndiaStrategy,
    VatEuStrategy,
    NoTaxStrategy,
  ],
  exports: [TaxService],
})
export class TaxModule {}
