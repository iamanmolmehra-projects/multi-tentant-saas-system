import { Injectable, NotFoundException } from '@nestjs/common';
import { PayslipEntity } from './entities/payslip.entity';
import { PayslipRepository } from './repositories/payslip.repository';

export interface CreatePayslipData {
  orgId: string;
  userId: string;
  runId: string;
  periodStart: Date;
  periodEnd: Date;
  grossSalary: number;
  netSalary: number;
  components: Record<string, number>;
  deductions: Record<string, number>;
  reimbursements: number;
}

@Injectable()
export class PayslipsService {
  constructor(private readonly payslipRepository: PayslipRepository) {}

  async create(data: CreatePayslipData): Promise<PayslipEntity> {
    // Calculate YTD values
    const financialYearStart = this.getFinancialYearStart(data.periodStart);
    const ytd = await this.payslipRepository.getYtdTotals(
      data.orgId,
      data.userId,
      financialYearStart,
      data.periodStart,
    );

    return this.payslipRepository.create({
      orgId: data.orgId,
      userId: data.userId,
      runId: data.runId,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      grossSalary: data.grossSalary,
      netSalary: data.netSalary,
      components: data.components,
      deductions: data.deductions,
      reimbursements: data.reimbursements,
      ytdGross: ytd.ytdGross + data.grossSalary,
      ytdTax: ytd.ytdTax + (data.deductions['tax'] || 0),
    });
  }

  async findByUser(
    orgId: string,
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: PayslipEntity[]; total: number }> {
    const [data, total] = await this.payslipRepository.findByUser(orgId, userId, { page, limit });
    return { data, total };
  }

  async findById(id: string, orgId: string): Promise<PayslipEntity> {
    const payslip = await this.payslipRepository.findById(id, orgId);
    if (!payslip) {
      throw new NotFoundException(`Payslip ${id} not found`);
    }
    return payslip;
  }

  async getPdfUrl(id: string, orgId: string): Promise<string> {
    const payslip = await this.findById(id, orgId);
    if (!payslip.pdfUrl) {
      throw new NotFoundException('PDF not yet generated for this payslip');
    }
    return payslip.pdfUrl;
  }

  private getFinancialYearStart(date: Date): Date {
    const year = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
    return new Date(year, 3, 1); // April 1st (India financial year)
  }
}
