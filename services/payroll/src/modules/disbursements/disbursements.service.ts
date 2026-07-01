import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PayrollRunsService } from '../payroll-runs/payroll-runs.service';

/**
 * Interface for bank file format generators.
 * Each bank has its own file format for bulk salary transfers.
 */
export interface BankFileFormatGenerator {
  readonly bankCode: string;
  readonly formatName: string;

  generateFile(data: DisbursementData[]): string;
  getFileExtension(): string;
}

export interface DisbursementData {
  employeeName: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
  currency: string;
  reference: string;
}

/**
 * HDFC Bank NEFT/RTGS file format generator.
 */
class HdfcFormatGenerator implements BankFileFormatGenerator {
  readonly bankCode = 'HDFC';
  readonly formatName = 'HDFC Bulk Upload Format';

  generateFile(data: DisbursementData[]): string {
    const header = 'HDFC_BULK_PAYMENT';
    const rows = data.map(
      (d, idx) =>
        `${idx + 1}|${d.accountNumber}|${d.ifscCode}|${d.employeeName}|${d.amount.toFixed(2)}|${d.currency}|${d.reference}|NEFT`,
    );
    return [header, ...rows].join('\n');
  }

  getFileExtension(): string {
    return '.txt';
  }
}

/**
 * ICICI Bank CMS file format generator.
 */
class IciciFormatGenerator implements BankFileFormatGenerator {
  readonly bankCode = 'ICICI';
  readonly formatName = 'ICICI CMS Format';

  generateFile(data: DisbursementData[]): string {
    const header = 'TXN_TYPE,BENEFICIARY_NAME,ACCOUNT_NO,IFSC,AMOUNT,CURRENCY,NARRATION';
    const rows = data.map(
      (d) =>
        `NEFT,${d.employeeName},${d.accountNumber},${d.ifscCode},${d.amount.toFixed(2)},${d.currency},Salary - ${d.reference}`,
    );
    return [header, ...rows].join('\n');
  }

  getFileExtension(): string {
    return '.csv';
  }
}

/**
 * SBI Bank CMP file format generator.
 */
class SbiFormatGenerator implements BankFileFormatGenerator {
  readonly bankCode = 'SBI';
  readonly formatName = 'SBI CMP Format';

  generateFile(data: DisbursementData[]): string {
    const rows = data.map(
      (d) => ({
        beneficiaryName: d.employeeName,
        accountNo: d.accountNumber,
        ifsc: d.ifscCode,
        amount: d.amount,
        transferMode: 'NEFT',
        remarks: `SAL-${d.reference}`,
      }),
    );
    return JSON.stringify({ format: 'SBI_CMP', transactions: rows }, null, 2);
  }

  getFileExtension(): string {
    return '.json';
  }
}

/**
 * Factory for creating bank-specific file format generators.
 * Uses the Factory pattern to provide the correct generator
 * based on the organization's bank preference.
 */
@Injectable()
export class DisbursementsService {
  private readonly logger = new Logger(DisbursementsService.name);
  private readonly generators: Map<string, BankFileFormatGenerator>;

  constructor(private readonly payrollRunsService: PayrollRunsService) {
    // Register available bank format generators
    this.generators = new Map<string, BankFileFormatGenerator>();
    this.generators.set('HDFC', new HdfcFormatGenerator());
    this.generators.set('ICICI', new IciciFormatGenerator());
    this.generators.set('SBI', new SbiFormatGenerator());
  }

  /**
   * Generates a bank file for a completed payroll run.
   * Uses Factory pattern to select the appropriate format generator.
   */
  async generateBankFile(
    orgId: string,
    runId: string,
    bankCode: string,
    employeeData: DisbursementData[],
  ): Promise<{ content: string; filename: string }> {
    const generator = this.getGenerator(bankCode);

    // Validate run exists and is completed
    const run = await this.payrollRunsService.findById(runId, orgId);
    if (run.status !== 'completed') {
      throw new Error(`Cannot generate bank file for run with status: ${run.status}`);
    }

    const content = generator.generateFile(employeeData);
    const filename = `payroll_${runId}_${bankCode}${generator.getFileExtension()}`;

    this.logger.log(
      `Generated ${generator.formatName} file for run ${runId}: ${employeeData.length} records`,
    );

    return { content, filename };
  }

  /**
   * Factory method: returns the appropriate generator for the given bank code.
   */
  private getGenerator(bankCode: string): BankFileFormatGenerator {
    const generator = this.generators.get(bankCode.toUpperCase());
    if (!generator) {
      const available = Array.from(this.generators.keys()).join(', ');
      throw new NotFoundException(
        `Bank format generator not found for: ${bankCode}. Available: ${available}`,
      );
    }
    return generator;
  }

  /**
   * Lists all supported bank formats.
   */
  getSupportedBanks(): Array<{ bankCode: string; formatName: string }> {
    return Array.from(this.generators.values()).map((g) => ({
      bankCode: g.bankCode,
      formatName: g.formatName,
    }));
  }
}
