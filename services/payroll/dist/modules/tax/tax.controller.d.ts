import { IAuthenticatedUser } from '@multi-tenant/shared';
import { TaxService } from './tax.service';
import { CreateTaxDeclarationDto } from './dto/create-tax-declaration.dto';
export declare class TaxController {
    private readonly taxService;
    constructor(taxService: TaxService);
    createDeclaration(orgId: string, user: IAuthenticatedUser, dto: CreateTaxDeclarationDto): Promise<import("./entities/tax-declaration.entity").TaxDeclarationEntity>;
    findMyDeclarations(orgId: string, user: IAuthenticatedUser): Promise<import("./entities/tax-declaration.entity").TaxDeclarationEntity[]>;
    findDeclaration(financialYear: string, orgId: string, user: IAuthenticatedUser): Promise<import("./entities/tax-declaration.entity").TaxDeclarationEntity>;
}
