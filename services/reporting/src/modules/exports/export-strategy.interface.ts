/**
 * Strategy pattern interface for report export formats.
 * Each format (PDF, CSV, Excel) implements this interface.
 */
export interface ExportStrategy {
  readonly format: string;
  readonly mimeType: string;
  readonly fileExtension: string;
  generate(data: Record<string, unknown>[], columns: string[]): Promise<Buffer>;
}
