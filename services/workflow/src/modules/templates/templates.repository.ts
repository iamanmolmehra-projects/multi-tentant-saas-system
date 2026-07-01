import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowTemplateEntity } from './entities/workflow-template.entity';

@Injectable()
export class TemplatesRepository {
  constructor(
    @InjectRepository(WorkflowTemplateEntity)
    private readonly repo: Repository<WorkflowTemplateEntity>,
  ) {}

  async create(data: Partial<WorkflowTemplateEntity>): Promise<WorkflowTemplateEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAllByOrg(orgId: string): Promise<WorkflowTemplateEntity[]> {
    return this.repo.find({
      where: { orgId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, orgId: string): Promise<WorkflowTemplateEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['escalationRules'],
    });
  }

  async findByOrgAndTrigger(orgId: string, triggerType: string): Promise<WorkflowTemplateEntity | null> {
    return this.repo.findOne({
      where: { orgId, triggerType, isActive: true },
      order: { version: 'DESC' },
    });
  }

  async update(entity: WorkflowTemplateEntity): Promise<WorkflowTemplateEntity> {
    return this.repo.save(entity);
  }

  async softDelete(id: string, orgId: string): Promise<void> {
    await this.repo.softDelete({ id, orgId });
  }
}
