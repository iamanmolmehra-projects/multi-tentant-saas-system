import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReimbursementEntity } from './entities/reimbursement.entity';
import { ReimbursementsService } from './reimbursements.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReimbursementEntity])],
  providers: [ReimbursementsService],
  exports: [ReimbursementsService],
})
export class ReimbursementsModule {}
