"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DisbursementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementsService = void 0;
const common_1 = require("@nestjs/common");
const payroll_runs_service_1 = require("../payroll-runs/payroll-runs.service");
class HdfcFormatGenerator {
    constructor() {
        this.bankCode = 'HDFC';
        this.formatName = 'HDFC Bulk Upload Format';
    }
    generateFile(data) {
        const header = 'HDFC_BULK_PAYMENT';
        const rows = data.map((d, idx) => `${idx + 1}|${d.accountNumber}|${d.ifscCode}|${d.employeeName}|${d.amount.toFixed(2)}|${d.currency}|${d.reference}|NEFT`);
        return [header, ...rows].join('\n');
    }
    getFileExtension() {
        return '.txt';
    }
}
class IciciFormatGenerator {
    constructor() {
        this.bankCode = 'ICICI';
        this.formatName = 'ICICI CMS Format';
    }
    generateFile(data) {
        const header = 'TXN_TYPE,BENEFICIARY_NAME,ACCOUNT_NO,IFSC,AMOUNT,CURRENCY,NARRATION';
        const rows = data.map((d) => `NEFT,${d.employeeName},${d.accountNumber},${d.ifscCode},${d.amount.toFixed(2)},${d.currency},Salary - ${d.reference}`);
        return [header, ...rows].join('\n');
    }
    getFileExtension() {
        return '.csv';
    }
}
class SbiFormatGenerator {
    constructor() {
        this.bankCode = 'SBI';
        this.formatName = 'SBI CMP Format';
    }
    generateFile(data) {
        const rows = data.map((d) => ({
            beneficiaryName: d.employeeName,
            accountNo: d.accountNumber,
            ifsc: d.ifscCode,
            amount: d.amount,
            transferMode: 'NEFT',
            remarks: `SAL-${d.reference}`,
        }));
        return JSON.stringify({ format: 'SBI_CMP', transactions: rows }, null, 2);
    }
    getFileExtension() {
        return '.json';
    }
}
let DisbursementsService = DisbursementsService_1 = class DisbursementsService {
    constructor(payrollRunsService) {
        this.payrollRunsService = payrollRunsService;
        this.logger = new common_1.Logger(DisbursementsService_1.name);
        this.generators = new Map();
        this.generators.set('HDFC', new HdfcFormatGenerator());
        this.generators.set('ICICI', new IciciFormatGenerator());
        this.generators.set('SBI', new SbiFormatGenerator());
    }
    async generateBankFile(orgId, runId, bankCode, employeeData) {
        const generator = this.getGenerator(bankCode);
        const run = await this.payrollRunsService.findById(runId, orgId);
        if (run.status !== 'completed') {
            throw new Error(`Cannot generate bank file for run with status: ${run.status}`);
        }
        const content = generator.generateFile(employeeData);
        const filename = `payroll_${runId}_${bankCode}${generator.getFileExtension()}`;
        this.logger.log(`Generated ${generator.formatName} file for run ${runId}: ${employeeData.length} records`);
        return { content, filename };
    }
    getGenerator(bankCode) {
        const generator = this.generators.get(bankCode.toUpperCase());
        if (!generator) {
            const available = Array.from(this.generators.keys()).join(', ');
            throw new common_1.NotFoundException(`Bank format generator not found for: ${bankCode}. Available: ${available}`);
        }
        return generator;
    }
    getSupportedBanks() {
        return Array.from(this.generators.values()).map((g) => ({
            bankCode: g.bankCode,
            formatName: g.formatName,
        }));
    }
};
exports.DisbursementsService = DisbursementsService;
exports.DisbursementsService = DisbursementsService = DisbursementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_runs_service_1.PayrollRunsService])
], DisbursementsService);
//# sourceMappingURL=disbursements.service.js.map