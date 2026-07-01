import { Injectable } from '@nestjs/common';
import { ExportStrategy } from '../export-strategy.interface';

@Injectable()
export class PdfExportStrategy implements ExportStrategy {
  readonly format = 'pdf';
  readonly mimeType = 'application/pdf';
  readonly fileExtension = '.pdf';

  async generate(data: Record<string, unknown>[], columns: string[]): Promise<Buffer> {
    // In production, use a PDF library (pdfkit, puppeteer, etc.)
    const content = `PDF Report\n\nColumns: ${columns.join(', ')}\nRows: ${data.length}\n\n${JSON.stringify(data, null, 2)}`;
    return Buffer.from(content, 'utf-8');
  }
}
