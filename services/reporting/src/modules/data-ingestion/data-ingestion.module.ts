import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactExpenseEntity } from './entities/fact-expense.entity';
import { FactPayrollEntity } from './entities/fact-payroll.entity';
import { FactInvoiceEntity } from './entities/fact-invoice.entity';
import { DataIngestionService } from './data-ingestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([FactExpenseEntity, FactPayrollEntity, FactInvoiceEntity])],
  providers: [DataIngestionService],
  exports: [DataIngestionService],
})
export class DataIngestionModule {}
