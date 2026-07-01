import { Injectable } from '@nestjs/common';
import { ExportStrategy } from '../export-strategy.interface';

@Injectable()
export class CsvExportStrategy implements ExportStrategy {
  readonly format = 'csv';
  readonly mimeType = 'text/csv';
  readonly fileExtension = '.csv';

  async generate(data: Record<string, unknown>[], columns: string[]): Promise<Buffer> {
    const header = columns.join(',');
    const rows = data.map((row) => columns.map((col) => `"${String(row[col] ?? '')}"`).join(','));
    return Buffer.from([header, ...rows].join('\n'), 'utf-8');
  }
}
