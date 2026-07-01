import { Injectable } from '@nestjs/common';
import { InvoiceEntity } from '../invoices/entities/invoice.entity';

/**
 * PDF template interface for different invoice layouts per organization.
 */
export interface PdfTemplate {
  /** Generate PDF buffer from invoice data */
  generate(invoice: InvoiceEntity, orgConfig: OrgPdfConfig): Promise<Buffer>;
  /** Template name identifier */
  templateName: string;
}

export interface OrgPdfConfig {
  orgId: string;
  companyName: string;
  companyAddress: Record<string, unknown>;
  logoUrl?: string;
  templateName?: string;
  primaryColor?: string;
  footerText?: string;
}

/**
 * PdfService — Factory pattern for generating invoice PDFs.
 *
 * Selects the appropriate PDF template based on organization configuration.
 * Organizations can customize their invoice appearance through template selection.
 *
 * Templates:
 * - 'standard' (default) — Clean professional layout
 * - 'minimal' — Minimalist design for modern brands
 * - 'detailed' — Comprehensive layout with tax breakdown
 */
@Injectable()
export class PdfService {
  /**
   * Generate an invoice PDF using the appropriate template for the organization.
   * @param invoice - The full invoice entity with line items
   * @param orgConfig - Organization PDF configuration (template, branding)
   * @returns Buffer containing the generated PDF
   */
  async generateInvoicePdf(
    invoice: InvoiceEntity,
    orgConfig: OrgPdfConfig,
  ): Promise<Buffer> {
    const template = this.getTemplate(orgConfig.templateName);
    return template.generate(invoice, orgConfig);
  }

  /**
   * Factory method: selects the PDF template implementation based on template name.
   */
  private getTemplate(templateName?: string): PdfTemplate {
    switch (templateName) {
      case 'minimal':
        return this.createMinimalTemplate();
      case 'detailed':
        return this.createDetailedTemplate();
      case 'standard':
      default:
        return this.createStandardTemplate();
    }
  }

  private createStandardTemplate(): PdfTemplate {
    return {
      templateName: 'standard',
      generate: async (invoice: InvoiceEntity, _orgConfig: OrgPdfConfig): Promise<Buffer> => {
        // Standard template: clean professional layout
        // In production, this would use a PDF library (e.g., PDFKit, Puppeteer)
        const content = this.buildStandardHtml(invoice, _orgConfig);
        return Buffer.from(content, 'utf-8');
      },
    };
  }

  private createMinimalTemplate(): PdfTemplate {
    return {
      templateName: 'minimal',
      generate: async (invoice: InvoiceEntity, _orgConfig: OrgPdfConfig): Promise<Buffer> => {
        // Minimal template: minimalist design
        const content = this.buildMinimalHtml(invoice, _orgConfig);
        return Buffer.from(content, 'utf-8');
      },
    };
  }

  private createDetailedTemplate(): PdfTemplate {
    return {
      templateName: 'detailed',
      generate: async (invoice: InvoiceEntity, _orgConfig: OrgPdfConfig): Promise<Buffer> => {
        // Detailed template: comprehensive with full tax breakdown
        const content = this.buildDetailedHtml(invoice, _orgConfig);
        return Buffer.from(content, 'utf-8');
      },
    };
  }

  private buildStandardHtml(invoice: InvoiceEntity, orgConfig: OrgPdfConfig): string {
    return `
      <html>
        <head><title>Invoice ${invoice.invoiceNumber}</title></head>
        <body>
          <h1>${orgConfig.companyName}</h1>
          <h2>Invoice #${invoice.invoiceNumber}</h2>
          <p>Date: ${invoice.issueDate}</p>
          <p>Due: ${invoice.dueDate}</p>
          <p>Total: ${invoice.currency} ${invoice.totalAmount}</p>
        </body>
      </html>
    `;
  }

  private buildMinimalHtml(invoice: InvoiceEntity, orgConfig: OrgPdfConfig): string {
    return `
      <html>
        <body style="font-family: sans-serif;">
          <p><strong>${orgConfig.companyName}</strong></p>
          <p>Invoice ${invoice.invoiceNumber} — ${invoice.currency} ${invoice.totalAmount}</p>
        </body>
      </html>
    `;
  }

  private buildDetailedHtml(invoice: InvoiceEntity, orgConfig: OrgPdfConfig): string {
    const lineItemsHtml = (invoice.lineItems || [])
      .map(
        (item) =>
          `<tr><td>${item.description}</td><td>${item.quantity}</td><td>${item.unitPrice}</td><td>${item.taxAmount}</td><td>${item.lineTotal}</td></tr>`,
      )
      .join('');

    return `
      <html>
        <head><title>Invoice ${invoice.invoiceNumber}</title></head>
        <body>
          <h1>${orgConfig.companyName}</h1>
          <h2>Invoice #${invoice.invoiceNumber}</h2>
          <table>
            <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Tax</th><th>Total</th></tr></thead>
            <tbody>${lineItemsHtml}</tbody>
          </table>
          <p>Subtotal: ${invoice.subtotal}</p>
          <p>Tax: ${invoice.taxAmount}</p>
          <p>Discount: ${invoice.discountAmount}</p>
          <p><strong>Total: ${invoice.currency} ${invoice.totalAmount}</strong></p>
          ${orgConfig.footerText ? `<footer>${orgConfig.footerText}</footer>` : ''}
        </body>
      </html>
    `;
  }
}
