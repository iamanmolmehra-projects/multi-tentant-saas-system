import { Module } from '@nestjs/common';
import { DisbursementsService } from './disbursements.service';
import { PayrollRunsModule } from '../payroll-runs/payroll-runs.module';

@Module({
  imports: [PayrollRunsModule],
  providers: [DisbursementsService],
  exports: [DisbursementsService],
})
export class DisbursementsModule {}
