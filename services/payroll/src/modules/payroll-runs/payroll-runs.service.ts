import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PayrollRunEntity } from './entities/payroll-run.entity';
import { PayrollRunRepository } from './repositories/payroll-run.repository';
import { SalaryStructuresService } from '../salary-structures/salary-structures.service';
import { PayrollCyclesService } from '../payroll-cycles/payroll-cycles.service';
import { TaxService } from '../tax/tax.service';
import { PayslipsService } from '../payslips/payslips.service';
import { ReimbursementsService } from '../reimbursements/reimbursements.service';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PayrollRunsService {
  private readonly logger = new Logger(PayrollRunsService.name);

  constructor(
    private readonly payrollRunRepository: PayrollRunRepository,
    private readonly salaryStructuresService: SalaryStructuresService,
    private readonly payrollCyclesService: PayrollCyclesService,
    private readonly taxService: TaxService,
    private readonly payslipsService: PayslipsService,
    private readonly reimbursementsService: ReimbursementsService,
  ) {}

  /**
   * Triggers a payroll run with pessimistic locking using lock_key.
   * Uses idempotency_key to prevent duplicate runs.
   */
  async trigger(
    orgId: string,
    processedBy: string,
    dto: TriggerPayrollRunDto,
  ): Promise<PayrollRunEntity> {
    // Idempotency check
    if (dto.idempotencyKey) {
      const existing = await this.payrollRunRepository.findByIdempotencyKey(dto.idempotencyKey);
      if (existing) {
        this.logger.log(`Returning existing run for idempotency key: ${dto.idempotencyKey}`);
        return existing;
      }
    }

    // Validate cycle exists
    await this.payrollCyclesService.findById(dto.cycleId, orgId);

    // Create run in pending state
    const idempotencyKey = dto.idempotencyKey || `run-${orgId}-${dto.cycleId}-${dto.periodStart}`;
    const run = await this.payrollRunRepository.create({
      orgId,
      cycleId: dto.cycleId,
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
      status: 'pending',
      processedBy,
      idempotencyKey,
    });

    // Acquire pessimistic lock
    const lockKey = `lock-${orgId}-${dto.cycleId}-${dto.periodStart}-${dto.periodEnd}`;
    const lockAcquired = await this.payrollRunRepository.acquireLock(lockKey, run.id);

    if (!lockAcquired) {
      await this.payrollRunRepository.updateStatus(run.id, 'failed', {
        errorDetails: { message: 'Could not acquire lock. Another run may be in progress.' },
      });
      throw new ConflictException('Another payroll run is already in progress for this period');
    }

    try {
      // Update status to processing
      await this.payrollRunRepository.updateStatus(run.id, 'processing', {
        startedAt: new Date(),
      });

      // Get all salary structures for the org
      const salaryStructures = await this.salaryStructuresService.findAllCurrentByOrg(orgId);

      let totalGross = 0;
      let totalNet = 0;
      let totalTax = 0;
      let employeeCount = 0;

      for (const salary of salaryStructures) {
        // Calculate gross
        const componentTotal = Object.values(salary.components).reduce((sum, val) => sum + val, 0);
        const grossSalary = Number(salary.baseSalary) + componentTotal;

        // Calculate tax using strategy pattern
        const taxAmount = await this.taxService.calculateTax(orgId, salary.userId, grossSalary);

        // Calculate deductions
        const deductionTotal = Object.values(salary.deductions).reduce((sum, val) => sum + val, 0);

        // Get pending reimbursements
        const reimbursementAmount = await this.reimbursementsService.getPendingTotal(
          orgId,
          salary.userId,
        );

        // Net salary = gross - tax - deductions + reimbursements
        const netSalary = grossSalary - taxAmount - deductionTotal + reimbursementAmount;

        // Create payslip
        await this.payslipsService.create({
          orgId,
          userId: salary.userId,
          runId: run.id,
          periodStart: new Date(dto.periodStart),
          periodEnd: new Date(dto.periodEnd),
          grossSalary,
          netSalary,
          components: salary.components,
          deductions: { ...salary.deductions, tax: taxAmount },
          reimbursements: reimbursementAmount,
        });

        // Mark reimbursements as included
        await this.reimbursementsService.markAsIncluded(orgId, salary.userId, run.id);

        totalGross += grossSalary;
        totalNet += netSalary;
        totalTax += taxAmount;
        employeeCount++;
      }

      // Update run with totals
      await this.payrollRunRepository.updateStatus(run.id, 'completed', {
        totalGross,
        totalNet,
        totalTax,
        employeeCount,
        completedAt: new Date(),
      });

      this.logger.log(`Payroll run ${run.id} completed: ${employeeCount} employees processed`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.payrollRunRepository.updateStatus(run.id, 'failed', {
        errorDetails: { message: errorMessage, timestamp: new Date().toISOString() },
      });
      this.logger.error(`Payroll run ${run.id} failed: ${errorMessage}`);
      throw error;
    } finally {
      // Always release lock
      await this.payrollRunRepository.releaseLock(run.id);
    }

    return this.payrollRunRepository.findById(run.id, orgId) as Promise<PayrollRunEntity>;
  }

  async findAllByOrg(orgId: string): Promise<PayrollRunEntity[]> {
    return this.payrollRunRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<PayrollRunEntity> {
    const run = await this.payrollRunRepository.findById(id, orgId);
    if (!run) {
      throw new NotFoundException(`Payroll run ${id} not found`);
    }
    return run;
  }

  async cancel(id: string, orgId: string, userId: string): Promise<PayrollRunEntity> {
    const run = await this.findById(id, orgId);

    if (!['pending', 'processing'].includes(run.status)) {
      throw new ConflictException(`Cannot cancel a payroll run with status: ${run.status}`);
    }

    await this.payrollRunRepository.updateStatus(id, 'cancelled', {
      completedAt: new Date(),
      errorDetails: { cancelledBy: userId, timestamp: new Date().toISOString() },
    });

    return this.findById(id, orgId);
  }
}
