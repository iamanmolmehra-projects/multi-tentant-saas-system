import { Repository } from 'typeorm';
import { TaxDeclarationEntity } from './entities/tax-declaration.entity';
import { IndiaNewRegimeStrategy } from './strategies/india-new-regime.strategy';
import { IndiaOldRegimeStrategy } from './strategies/india-old-regime.strategy';
import { CreateTaxDeclarationDto } from './dto/create-tax-declaration.dto';
export declare class TaxService {
    private readonly taxDeclarationRepo;
    private readonly indiaNewRegime;
    private readonly indiaOldRegime;
    private readonly logger;
    private readonly strategies;
    constructor(taxDeclarationRepo: Repository<TaxDeclarationEntity>, indiaNewRegime: IndiaNewRegimeStrategy, indiaOldRegime: IndiaOldRegimeStrategy);
    calculateTax(orgId: string, userId: string, monthlyGross: number): Promise<number>;
    private getStrategy;
    createDeclaration(orgId: string, userId: string, dto: CreateTaxDeclarationDto): Promise<TaxDeclarationEntity>;
    findDeclaration(orgId: string, userId: string, financialYear: string): Promise<TaxDeclarationEntity>;
    findDeclarationsByUser(orgId: string, userId: string): Promise<TaxDeclarationEntity[]>;
    private getCurrentFinancialYear;
    private getMonthsRemainingInFy;
}
