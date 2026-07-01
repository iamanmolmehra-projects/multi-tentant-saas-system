import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactExpenseEntity } from './entities/fact-expense.entity';
import { FactPayrollEntity } from './entities/fact-payroll.entity';
import { FactInvoiceEntity } from './entities/fact-invoice.entity';

/**
 * Ingests events from other services into denormalized fact tables.
 * Uses UPSERT (ON CONFLICT) for idempotent event processing.
 */
@Injectable()
export class DataIngestionService {
  private readonly logger = new Logger(DataIngestionService.name);

  constructor(
    @InjectRepository(FactExpenseEntity) private readonly expenseRepo: Repository<FactExpenseEntity>,
    @InjectRepository(FactPayrollEntity) private readonly payrollRepo: Repository<FactPayrollEntity>,
    @InjectRepository(FactInvoiceEntity) private readonly invoiceRepo: Repository<FactInvoiceEntity>,
  ) {}

  async ingestExpenseEvent(data: Partial<FactExpenseEntity>): Promise<void> {
    await this.expenseRepo.upsert(data, ['id']);
    this.logger.debug(`Ingested expense event: ${data.id}`);
  }

  async ingestPayrollEvent(data: Partial<FactPayrollEntity>): Promise<void> {
    await this.payrollRepo.upsert(data, ['id']);
    this.logger.debug(`Ingested payroll event: ${data.id}`);
  }

  async ingestInvoiceEvent(data: Partial<FactInvoiceEntity>): Promise<void> {
    await this.invoiceRepo.upsert(data, ['id']);
    this.logger.debug(`Ingested invoice event: ${data.id}`);
  }
}
