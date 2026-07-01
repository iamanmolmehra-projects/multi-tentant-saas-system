import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WorkflowStepEntity } from './entities/workflow-step.entity';
import { WorkflowInstanceEntity } from '../instances/entities/workflow-instance.entity';
import { StepsRepository } from './steps.repository';

@Injectable()
export class StepsService {
  constructor(
    private readonly stepsRepository: StepsRepository,
    private readonly dataSource: DataSource,
    @InjectRepository(WorkflowInstanceEntity)
    private readonly instanceRepo: Repository<WorkflowInstanceEntity>,
  ) {}

  async findPendingForApprover(approverId: string): Promise<WorkflowStepEntity[]> {
    return this.stepsRepository.findPendingByApprover(approverId);
  }

  /**
   * Approve a workflow step using pessimistic locking (SELECT FOR UPDATE)
   * to prevent concurrent approval of the same step.
   */
  async approve(stepId: string, userId: string, comments?: string): Promise<WorkflowStepEntity> {
    return this.transitionStep(stepId, userId, 'approved', comments);
  }

  /**
   * Reject a workflow step using pessimistic locking (SELECT FOR UPDATE)
   * to prevent concurrent rejection of the same step.
   */
  async reject(stepId: string, userId: string, comments?: string): Promise<WorkflowStepEntity> {
    return this.transitionStep(stepId, userId, 'rejected', comments);
  }

  /**
   * Core step transition logic with pessimistic locking.
   * Uses SELECT FOR UPDATE to ensure only one concurrent request can
   * transition a step at a time, preventing race conditions.
   */
  private async transitionStep(
    stepId: string,
    userId: string,
    decision: 'approved' | 'rejected',
    comments?: string,
  ): Promise<WorkflowStepEntity> {
    return this.dataSource.transaction(async (manager) => {
      // Acquire pessimistic lock via SELECT FOR UPDATE
      const step = await this.stepsRepository.findByIdForUpdate(stepId, manager);

      if (!step) {
        throw new NotFoundException(`Workflow step with id ${stepId} not found`);
      }

      if (step.status !== 'pending') {
        throw new BadRequestException(
          `Step is already in status '${step.status}' and cannot be transitioned`,
        );
      }

      // Verify the user is the assigned approver
      if (step.approverId !== userId) {
        throw new ForbiddenException('You are not the assigned approver for this step');
      }

      // Transition the step
      step.status = decision;
      step.comments = comments || null;
      step.decidedAt = new Date();

      const savedStep = await this.stepsRepository.save(step, manager);

      // Handle workflow progression
      const instance = step.instance;

      if (decision === 'approved') {
        // Move to next step or complete the workflow
        const nextStepNumber = step.stepNumber + 1;
        const nextStep = await this.stepsRepository.findNextStep(instance.id, nextStepNumber);

        if (nextStep) {
          // Activate the next step
          nextStep.status = 'pending';
          await this.stepsRepository.save(nextStep, manager);

          instance.currentStep = nextStepNumber;
          await manager.save(WorkflowInstanceEntity, instance);
        } else {
          // No more steps - workflow is complete
          instance.status = 'completed';
          instance.completedAt = new Date();
          await manager.save(WorkflowInstanceEntity, instance);
        }
      } else if (decision === 'rejected') {
        // Rejection ends the workflow
        instance.status = 'rejected';
        instance.completedAt = new Date();
        await manager.save(WorkflowInstanceEntity, instance);
      }

      return savedStep;
    });
  }
}
