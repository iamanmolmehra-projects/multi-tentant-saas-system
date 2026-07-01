import { Injectable, NotFoundException } from '@nestjs/common';
import { PayrollCycleEntity } from './entities/payroll-cycle.entity';
import { PayrollCycleRepository } from './repositories/payroll-cycle.repository';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';

@Injectable()
export class PayrollCyclesService {
  constructor(
    private readonly payrollCycleRepository: PayrollCycleRepository,
  ) {}

  async create(
    orgId: string,
    dto: CreatePayrollCycleDto,
  ): Promise<PayrollCycleEntity> {
    return this.payrollCycleRepository.create({
      orgId,
      name: dto.name,
      frequency: dto.frequency,
      payDay: dto.payDay,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      isActive: true,
    });
  }

  async findAllByOrg(orgId: string): Promise<PayrollCycleEntity[]> {
    return this.payrollCycleRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<PayrollCycleEntity> {
    const cycle = await this.payrollCycleRepository.findById(id, orgId);
    if (!cycle) {
      throw new NotFoundException(`Payroll cycle ${id} not found`);
    }
    return cycle;
  }
}
