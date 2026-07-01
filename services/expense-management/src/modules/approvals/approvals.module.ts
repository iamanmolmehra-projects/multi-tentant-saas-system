import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalEntity } from './entities/approval.entity';
import { ApprovalsService } from './approvals.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalEntity])],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
