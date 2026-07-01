import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportStrategy } from './export-strategy.interface';
import { CsvExportStrategy } from './strategies/csv-export.strategy';
import { PdfExportStrategy } from './strategies/pdf-export.strategy';

/**
 * Factory pattern: Selects the appropriate export strategy based on format.
 */
@Injectable()
export class ExportFactory {
  private readonly strategies: Map<string, ExportStrategy>;

  constructor(
    private readonly csvStrategy: CsvExportStrategy,
    private readonly pdfStrategy: PdfExportStrategy,
  ) {
    this.strategies = new Map();
    this.strategies.set('csv', this.csvStrategy);
    this.strategies.set('pdf', this.pdfStrategy);
  }

  getStrategy(format: string): ExportStrategy {
    const strategy = this.strategies.get(format.toLowerCase());
    if (!strategy) {
      throw new NotFoundException(`Export format '${format}' not supported. Available: ${Array.from(this.strategies.keys()).join(', ')}`);
    }
    return strategy;
  }
}
