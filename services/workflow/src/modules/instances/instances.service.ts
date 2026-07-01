import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InstancesRepository } from './instances.repository';
import { TemplatesService } from '../templates/templates.service';
import { ApproverResolutionService } from '../approver-resolution/approver-resolution.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { WorkflowInstanceEntity } from './entities/workflow-instance.entity';
import { WorkflowStepEntity } from '../steps/entities/workflow-step.entity';

@Injectable()
export class InstancesService {
  constructor(
    private readonly instancesRepository: InstancesRepository,
    private readonly templatesService: TemplatesService,
    private readonly approverResolutionService: ApproverResolutionService,
  ) {}

  /**
   * Create a workflow instance. Idempotent: if a workflow already exists for the
   * given (trigger_entity_type, trigger_entity_id), return the existing instance.
   */
  async create(
    orgId: string,
    initiatedBy: string,
    dto: CreateInstanceDto,
  ): Promise<WorkflowInstanceEntity> {
    // Idempotency check via unique (trigger_entity_type, trigger_entity_id)
    const existing = await this.instancesRepository.findByTriggerEntity(
      dto.triggerEntityType,
      dto.triggerEntityId,
    );

    if (existing) {
      return existing;
    }

    // Find the active template for this trigger type
    const template = await this.templatesService.findActiveByTrigger(orgId, dto.triggerEntityType);
    if (!template) {
      throw new NotFoundException(
        `No active workflow template found for trigger type: ${dto.triggerEntityType}`,
      );
    }

    // Resolve approvers for each step using the strategy pattern
    const steps: Partial<WorkflowStepEntity>[] = [];
    for (const stepConfig of template.stepsConfig) {
      const approverId = await this.approverResolutionService.resolve(
        orgId,
        initiatedBy,
        {
          approverType: stepConfig.approverType,
          approverValue: stepConfig.approverValue,
          approverRole: stepConfig.approverRole,
        },
      );

      const slaHours = stepConfig.slaHours || null;
      const dueAt = slaHours ? new Date(Date.now() + slaHours * 60 * 60 * 1000) : null;

      steps.push({
        stepNumber: stepConfig.stepNumber,
        approverType: stepConfig.approverType,
        approverId,
        approverRole: stepConfig.approverRole || null,
        slaHours,
        dueAt,
        status: stepConfig.stepNumber === 1 ? 'pending' : 'waiting',
      });
    }

    const instance = await this.instancesRepository.create({
      orgId,
      templateId: template.id,
      templateVersion: template.version,
      triggerEntityType: dto.triggerEntityType,
      triggerEntityId: dto.triggerEntityId,
      initiatedBy,
      status: 'active',
      currentStep: 1,
      metadata: dto.metadata || {},
      startedAt: new Date(),
      steps: steps as WorkflowStepEntity[],
    });

    return instance;
  }

  async findAll(orgId: string): Promise<WorkflowInstanceEntity[]> {
    return this.instancesRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<WorkflowInstanceEntity> {
    const instance = await this.instancesRepository.findById(id, orgId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance with id ${id} not found`);
    }
    return instance;
  }

  async cancel(id: string, orgId: string, cancelledBy: string): Promise<WorkflowInstanceEntity> {
    const instance = await this.findById(id, orgId);

    if (instance.status !== 'active') {
      throw new BadRequestException(
        `Cannot cancel workflow instance in status: ${instance.status}`,
      );
    }

    instance.status = 'cancelled';
    instance.completedAt = new Date();

    return this.instancesRepository.save(instance);
  }
}
