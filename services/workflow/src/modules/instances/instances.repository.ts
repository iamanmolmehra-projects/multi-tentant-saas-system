import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowInstanceEntity } from './entities/workflow-instance.entity';

@Injectable()
export class InstancesRepository {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly repo: Repository<WorkflowInstanceEntity>,
  ) {}

  async create(data: Partial<WorkflowInstanceEntity>): Promise<WorkflowInstanceEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAllByOrg(orgId: string): Promise<WorkflowInstanceEntity[]> {
    return this.repo.find({
      where: { orgId },
      relations: ['template'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, orgId: string): Promise<WorkflowInstanceEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['template', 'steps'],
    });
  }

  async findByTriggerEntity(
    triggerEntityType: string,
    triggerEntityId: string,
  ): Promise<WorkflowInstanceEntity | null> {
    return this.repo.findOne({
      where: { triggerEntityType, triggerEntityId },
    });
  }

  async save(entity: WorkflowInstanceEntity): Promise<WorkflowInstanceEntity> {
    return this.repo.save(entity);
  }
}
