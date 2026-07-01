import { IAuthenticatedUser } from '@multi-tenant/shared';
import { PayslipsService } from './payslips.service';
export declare class PayslipsController {
    private readonly payslipsService;
    constructor(payslipsService: PayslipsService);
    findAll(orgId: string, user: IAuthenticatedUser, page?: number, limit?: number): Promise<{
        data: import("./entities/payslip.entity").PayslipEntity[];
        total: number;
    }>;
    findOne(id: string, orgId: string): Promise<import("./entities/payslip.entity").PayslipEntity>;
    getPdf(id: string, orgId: string): Promise<string>;
}
