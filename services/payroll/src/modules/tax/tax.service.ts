import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxDeclarationEntity } from './entities/tax-declaration.entity';
import { TaxCalculationStrategy } from './strategies/tax-calculation.strategy';
import { IndiaNewRegimeStrategy } from './strategies/india-new-regime.strategy';
import { IndiaOldRegimeStrategy } from './strategies/india-old-regime.strategy';
import { CreateTaxDeclarationDto } from './dto/create-tax-declaration.dto';

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);
  private readonly strategies: Map<string, TaxCalculationStrategy>;

  constructor(
    @InjectRepository(TaxDeclarationEntity)
    private readonly taxDeclarationRepo: Repository<TaxDeclarationEntity>,
    private readonly indiaNewRegime: IndiaNewRegimeStrategy,
    private readonly indiaOldRegime: IndiaOldRegimeStrategy,
  ) {
    // Register available strategies
    this.strategies = new Map<string, TaxCalculationStrategy>();
    this.strategies.set(indiaNewRegime.regime, indiaNewRegime);
    this.strategies.set(indiaOldRegime.regime, indiaOldRegime);
  }

  /**
   * Calculates monthly tax for an employee based on their regime and declarations.
   */
  async calculateTax(
    orgId: string,
    userId: string,
    monthlyGross: number,
  ): Promise<number> {
    const financialYear = this.getCurrentFinancialYear();

    // Get user's tax declaration (regime + deductions)
    const declaration = await this.taxDeclarationRepo.findOne({
      where: { orgId, userId, financialYear },
    });

    const regime = declaration?.regime || 'new';
    const strategy = this.getStrategy(regime);

    const annualGross = monthlyGross * 12;
    const annualTax = strategy.calculateAnnualTax(annualGross, declaration?.declarations);

    // Calculate monthly TDS based on months remaining in FY
    const monthsRemaining = this.getMonthsRemainingInFy();
    const monthlyTds = strategy.calculateMonthlyTds(annualTax, monthsRemaining);

    return monthlyTds;
  }

  /**
   * Retrieves the appropriate strategy based on regime name.
   */
  private getStrategy(regime: string): TaxCalculationStrategy {
    const strategy = this.strategies.get(regime);
    if (!strategy) {
      this.logger.warn(`Unknown tax regime: ${regime}, falling back to new regime`);
      return this.strategies.get('new')!;
    }
    return strategy;
  }

  /**
   * Creates or updates a tax declaration for a user.
   */
  async createDeclaration(
    orgId: string,
    userId: string,
    dto: CreateTaxDeclarationDto,
  ): Promise<TaxDeclarationEntity> {
    // Check if declaration already exists for this FY
    const existing = await this.taxDeclarationRepo.findOne({
      where: { orgId, userId, financialYear: dto.financialYear },
    });

    if (existing) {
      // Update existing declaration
      existing.regime = dto.regime || 'new';
      existing.declarations = dto.declarations;
      existing.status = dto.status || 'draft';
      return this.taxDeclarationRepo.save(existing);
    }

    return this.taxDeclarationRepo.save(
      this.taxDeclarationRepo.create({
        orgId,
        userId,
        financialYear: dto.financialYear,
        regime: dto.regime || 'new',
        declarations: dto.declarations,
        status: dto.status || 'draft',
      }),
    );
  }

  async findDeclaration(
    orgId: string,
    userId: string,
    financialYear: string,
  ): Promise<TaxDeclarationEntity> {
    const declaration = await this.taxDeclarationRepo.findOne({
      where: { orgId, userId, financialYear },
    });
    if (!declaration) {
      throw new NotFoundException(
        `Tax declaration not found for user ${userId} in FY ${financialYear}`,
      );
    }
    return declaration;
  }

  async findDeclarationsByUser(
    orgId: string,
    userId: string,
  ): Promise<TaxDeclarationEntity[]> {
    return this.taxDeclarationRepo.find({
      where: { orgId, userId },
      order: { financialYear: 'DESC' },
    });
  }

  private getCurrentFinancialYear(): string {
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-${(year + 1).toString().slice(2)}`;
  }

  private getMonthsRemainingInFy(): number {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    // FY ends in March (month 2)
    if (month >= 3) {
      return 12 - (month - 3); // April=12, May=11, ..., March=1
    }
    return 3 - month; // Jan=3, Feb=2, Mar=1
  }
}
