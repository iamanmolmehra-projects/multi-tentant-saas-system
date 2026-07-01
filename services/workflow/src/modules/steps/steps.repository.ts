import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WorkflowStepEntity } from './entities/workflow-step.entity';

@Injectable()
export class StepsRepository {
  constructor(
    @InjectRepository(WorkflowStepEntity)
    private readonly repo: Repository<WorkflowStepEntity>,
  ) {}

  async findPendingByApprover(approverId: string): Promise<WorkflowStepEntity[]> {
    return this.repo.find({
      where: { approverId, status: 'pending' },
      relations: ['instance', 'instance.template'],
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<WorkflowStepEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['instance'],
    });
  }

  /**
   * Acquire a pessimistic lock on the step row using SELECT ... FOR UPDATE.
   * Prevents concurrent approvals of the same step.
   */
  async findByIdForUpdate(id: string, manager: EntityManager): Promise<WorkflowStepEntity | null> {
    return manager
      .getRepository(WorkflowStepEntity)
      .createQueryBuilder('step')
      .setLock('pessimistic_write')
      .leftJoinAndSelect('step.instance', 'instance')
      .where('step.id = :id', { id })
      .getOne();
  }

  async save(entity: WorkflowStepEntity, manager?: EntityManager): Promise<WorkflowStepEntity> {
    if (manager) {
      return manager.save(WorkflowStepEntity, entity);
    }
    return this.repo.save(entity);
  }

  async findNextStep(instanceId: string, stepNumber: number): Promise<WorkflowStepEntity | null> {
    return this.repo.findOne({
      where: { instanceId, stepNumber },
    });
  }
}
