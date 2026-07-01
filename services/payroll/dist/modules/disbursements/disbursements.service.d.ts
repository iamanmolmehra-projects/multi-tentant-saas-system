import { PayrollRunsService } from '../payroll-runs/payroll-runs.service';
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
export declare class DisbursementsService {
    private readonly payrollRunsService;
    private readonly logger;
    private readonly generators;
    constructor(payrollRunsService: PayrollRunsService);
    generateBankFile(orgId: string, runId: string, bankCode: string, employeeData: DisbursementData[]): Promise<{
        content: string;
        filename: string;
    }>;
    private getGenerator;
    getSupportedBanks(): Array<{
        bankCode: string;
        formatName: string;
    }>;
}
