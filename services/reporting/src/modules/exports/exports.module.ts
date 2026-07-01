import { Module } from '@nestjs/common';
import { ExportFactory } from './export.factory';
import { CsvExportStrategy } from './strategies/csv-export.strategy';
import { PdfExportStrategy } from './strategies/pdf-export.strategy';

@Module({
  providers: [ExportFactory, CsvExportStrategy, PdfExportStrategy],
  exports: [ExportFactory],
})
export class ExportsModule {}
