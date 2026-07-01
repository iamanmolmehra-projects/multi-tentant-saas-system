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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipsService = void 0;
const common_1 = require("@nestjs/common");
const payslip_repository_1 = require("./repositories/payslip.repository");
let PayslipsService = class PayslipsService {
    constructor(payslipRepository) {
        this.payslipRepository = payslipRepository;
    }
    async create(data) {
        const financialYearStart = this.getFinancialYearStart(data.periodStart);
        const ytd = await this.payslipRepository.getYtdTotals(data.orgId, data.userId, financialYearStart, data.periodStart);
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
    async findByUser(orgId, userId, page, limit) {
        const [data, total] = await this.payslipRepository.findByUser(orgId, userId, { page, limit });
        return { data, total };
    }
    async findById(id, orgId) {
        const payslip = await this.payslipRepository.findById(id, orgId);
        if (!payslip) {
            throw new common_1.NotFoundException(`Payslip ${id} not found`);
        }
        return payslip;
    }
    async getPdfUrl(id, orgId) {
        const payslip = await this.findById(id, orgId);
        if (!payslip.pdfUrl) {
            throw new common_1.NotFoundException('PDF not yet generated for this payslip');
        }
        return payslip.pdfUrl;
    }
    getFinancialYearStart(date) {
        const year = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
        return new Date(year, 3, 1);
    }
};
exports.PayslipsService = PayslipsService;
exports.PayslipsService = PayslipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payslip_repository_1.PayslipRepository])
], PayslipsService);
//# sourceMappingURL=payslips.service.js.map