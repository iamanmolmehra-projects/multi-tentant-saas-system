import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SalaryStructureEntity } from './entities/salary-structure.entity';
import { SalaryStructureRepository } from './repositories/salary-structure.repository';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';

@Injectable()
export class SalaryStructuresService {
  constructor(
    private readonly salaryStructureRepository: SalaryStructureRepository,
  ) {}

  async create(
    orgId: string,
    dto: CreateSalaryStructureDto,
  ): Promise<SalaryStructureEntity> {
    // Mark previous structure as inactive
    const effectiveFrom = new Date(dto.effectiveFrom);
    const previousDay = new Date(effectiveFrom);
    previousDay.setDate(previousDay.getDate() - 1);

    await this.salaryStructureRepository.markPreviousAsInactive(
      orgId,
      dto.userId,
      previousDay,
    );

    return this.salaryStructureRepository.create({
      orgId,
      userId: dto.userId,
      baseSalary: dto.baseSalary,
      currency: dto.currency || 'INR',
      components: dto.components,
      deductions: dto.deductions || {},
      effectiveFrom,
      effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
      isCurrent: true,
    });
  }

  async findCurrentByUser(
    orgId: string,
    userId: string,
  ): Promise<SalaryStructureEntity> {
    const structure = await this.salaryStructureRepository.findCurrentByUser(orgId, userId);
    if (!structure) {
      throw new NotFoundException(`No active salary structure found for user ${userId}`);
    }
    return structure;
  }

  async findHistoryByUser(
    orgId: string,
    userId: string,
  ): Promise<SalaryStructureEntity[]> {
    return this.salaryStructureRepository.findHistoryByUser(orgId, userId);
  }

  async findAllCurrentByOrg(orgId: string): Promise<SalaryStructureEntity[]> {
    return this.salaryStructureRepository.findAllCurrentByOrg(orgId);
  }
}
