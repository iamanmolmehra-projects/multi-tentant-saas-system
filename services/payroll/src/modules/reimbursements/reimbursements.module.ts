import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollReimbursementEntity } from './entities/payroll-reimbursement.entity';
import { PayrollReimbursementRepository } from './repositories/payroll-reimbursement.repository';
import { ReimbursementsService } from './reimbursements.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollReimbursementEntity])],
  providers: [ReimbursementsService, PayrollReimbursementRepository],
  exports: [ReimbursementsService, PayrollReimbursementRepository],
})
export class ReimbursementsModule {}
