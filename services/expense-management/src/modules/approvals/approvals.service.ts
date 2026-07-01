import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalEntity } from './entities/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(ApprovalEntity)
    private readonly approvalRepo: Repository<ApprovalEntity>,
  ) {}

  async createApproval(data: {
    orgId: string;
    expenseId?: string;
    reportId?: string;
    approverId: string;
    level: number;
  }): Promise<ApprovalEntity> {
    const entity = this.approvalRepo.create({
      orgId: data.orgId,
      expenseId: data.expenseId || null,
      reportId: data.reportId || null,
      approverId: data.approverId,
      level: data.level,
      status: 'pending',
    });
    return this.approvalRepo.save(entity);
  }

  async approve(
    id: string,
    orgId: string,
    approverId: string,
    comments?: string,
  ): Promise<ApprovalEntity> {
    const approval = await this.approvalRepo.findOne({ where: { id, orgId } });
    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    approval.status = 'approved';
    approval.comments = comments || null;
    approval.decidedAt = new Date();
    return this.approvalRepo.save(approval);
  }

  async reject(
    id: string,
    orgId: string,
    approverId: string,
    comments?: string,
  ): Promise<ApprovalEntity> {
    const approval = await this.approvalRepo.findOne({ where: { id, orgId } });
    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    approval.status = 'rejected';
    approval.comments = comments || null;
    approval.decidedAt = new Date();
    return this.approvalRepo.save(approval);
  }

  async findPendingByApprover(orgId: string, approverId: string): Promise<ApprovalEntity[]> {
    return this.approvalRepo.find({
      where: { orgId, approverId, status: 'pending' },
      relations: ['expense', 'report'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByReportId(reportId: string, orgId: string): Promise<ApprovalEntity[]> {
    return this.approvalRepo.find({
      where: { reportId, orgId },
      order: { level: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByExpenseId(expenseId: string, orgId: string): Promise<ApprovalEntity[]> {
    return this.approvalRepo.find({
      where: { expenseId, orgId },
      order: { level: 'ASC', createdAt: 'ASC' },
    });
  }
}
