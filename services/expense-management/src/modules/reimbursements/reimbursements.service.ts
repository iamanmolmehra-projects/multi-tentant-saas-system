import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReimbursementEntity } from './entities/reimbursement.entity';

@Injectable()
export class ReimbursementsService {
  constructor(
    @InjectRepository(ReimbursementEntity)
    private readonly reimbursementRepo: Repository<ReimbursementEntity>,
  ) {}

  async createReimbursement(data: {
    orgId: string;
    reportId: string;
    userId: string;
    amount: number;
    currency: string;
  }): Promise<ReimbursementEntity> {
    const entity = this.reimbursementRepo.create({
      orgId: data.orgId,
      reportId: data.reportId,
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
    });
    return this.reimbursementRepo.save(entity);
  }

  async findByReportId(reportId: string, orgId: string): Promise<ReimbursementEntity | null> {
    return this.reimbursementRepo.findOne({
      where: { reportId, orgId },
      relations: ['report'],
    });
  }

  async findAllByUser(orgId: string, userId: string): Promise<ReimbursementEntity[]> {
    return this.reimbursementRepo.find({
      where: { orgId, userId },
      relations: ['report'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByOrg(orgId: string, status?: string): Promise<ReimbursementEntity[]> {
    const where: Record<string, unknown> = { orgId };
    if (status) {
      where.status = status;
    }
    return this.reimbursementRepo.find({
      where,
      relations: ['report'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsProcessing(id: string, orgId: string, payrollRef: string): Promise<ReimbursementEntity> {
    const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
    if (!reimbursement) {
      throw new NotFoundException('Reimbursement not found');
    }

    reimbursement.status = 'processing';
    reimbursement.payrollRef = payrollRef;
    return this.reimbursementRepo.save(reimbursement);
  }

  async markAsCompleted(id: string, orgId: string): Promise<ReimbursementEntity> {
    const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
    if (!reimbursement) {
      throw new NotFoundException('Reimbursement not found');
    }

    reimbursement.status = 'completed';
    reimbursement.processedAt = new Date();
    return this.reimbursementRepo.save(reimbursement);
  }

  async markAsFailed(id: string, orgId: string): Promise<ReimbursementEntity> {
    const reimbursement = await this.reimbursementRepo.findOne({ where: { id, orgId } });
    if (!reimbursement) {
      throw new NotFoundException('Reimbursement not found');
    }

    reimbursement.status = 'failed';
    return this.reimbursementRepo.save(reimbursement);
  }
}
