import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportDefinitionEntity } from './entities/report-definition.entity';
import { ReportExecutionEntity } from './entities/report-execution.entity';
import { ExportFactory } from '../exports/export.factory';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportDefinitionEntity) private readonly defRepo: Repository<ReportDefinitionEntity>,
    @InjectRepository(ReportExecutionEntity) private readonly execRepo: Repository<ReportExecutionEntity>,
    private readonly exportFactory: ExportFactory,
  ) {}

  async findAll(orgId: string): Promise<ReportDefinitionEntity[]> {
    return this.defRepo.find({ where: { orgId, isActive: true }, order: { createdAt: 'DESC' } });
  }

  async create(orgId: string, userId: string, data: Partial<ReportDefinitionEntity>): Promise<ReportDefinitionEntity> {
    return this.defRepo.save(this.defRepo.create({ ...data, orgId, createdBy: userId }));
  }

  async execute(orgId: string, reportId: string, params?: Record<string, unknown>): Promise<ReportExecutionEntity> {
    const def = await this.defRepo.findOne({ where: { id: reportId, orgId } });
    if (!def) throw new NotFoundException('Report definition not found');

    const execution = await this.execRepo.save(this.execRepo.create({
      orgId, reportId, status: 'pending', parameters: params || null, triggeredBy: 'user',
    }));

    // In production this would be a background job
    await this.execRepo.update(execution.id, { status: 'running', startedAt: new Date() });

    // Simulate report generation
    await this.execRepo.update(execution.id, {
      status: 'completed', completedAt: new Date(), rowCount: 0, resultUrl: `/exports/${execution.id}`,
    });

    return this.execRepo.findOne({ where: { id: execution.id } }) as Promise<ReportExecutionEntity>;
  }

  async getExecutions(orgId: string, reportId: string): Promise<ReportExecutionEntity[]> {
    return this.execRepo.find({ where: { orgId, reportId }, order: { createdAt: 'DESC' }, take: 20 });
  }
}
