import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseReportEntity } from './entities/expense-report.entity';
import { ReportRepository } from './repositories/report.repository';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseReportEntity]),
    ExpensesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository],
  exports: [ReportsService, ReportRepository],
})
export class ReportsModule {}
