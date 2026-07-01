import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollRunEntity } from './entities/payroll-run.entity';
import { PayrollRunRepository } from './repositories/payroll-run.repository';
import { PayrollRunsService } from './payroll-runs.service';
import { PayrollRunsController } from './payroll-runs.controller';
import { SalaryStructuresModule } from '../salary-structures/salary-structures.module';
import { PayrollCyclesModule } from '../payroll-cycles/payroll-cycles.module';
import { TaxModule } from '../tax/tax.module';
import { PayslipsModule } from '../payslips/payslips.module';
import { ReimbursementsModule } from '../reimbursements/reimbursements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayrollRunEntity]),
    SalaryStructuresModule,
    PayrollCyclesModule,
    TaxModule,
    PayslipsModule,
    ReimbursementsModule,
  ],
  controllers: [PayrollRunsController],
  providers: [PayrollRunsService, PayrollRunRepository],
  exports: [PayrollRunsService, PayrollRunRepository],
})
export class PayrollRunsModule {}
