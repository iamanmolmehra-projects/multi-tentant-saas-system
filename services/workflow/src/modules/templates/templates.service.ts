import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplatesRepository } from './templates.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { WorkflowTemplateEntity } from './entities/workflow-template.entity';

@Injectable()
export class TemplatesService {
  constructor(private readonly templatesRepository: TemplatesRepository) {}

  async create(orgId: string, dto: CreateTemplateDto): Promise<WorkflowTemplateEntity> {
    return this.templatesRepository.create({
      orgId,
      name: dto.name,
      description: dto.description || null,
      triggerType: dto.triggerType,
      stepsConfig: dto.stepsConfig as any,
      isActive: dto.isActive ?? true,
      version: 1,
    });
  }

  async findAll(orgId: string): Promise<WorkflowTemplateEntity[]> {
    return this.templatesRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<WorkflowTemplateEntity> {
    const template = await this.templatesRepository.findById(id, orgId);
    if (!template) {
      throw new NotFoundException(`Workflow template with id ${id} not found`);
    }
    return template;
  }

  /**
   * Update a template with automatic version increment.
   * Versioning ensures running workflow instances reference the template version
   * they were started with.
   */
  async update(id: string, orgId: string, dto: UpdateTemplateDto): Promise<WorkflowTemplateEntity> {
    const template = await this.findById(id, orgId);

    if (dto.name !== undefined) template.name = dto.name;
    if (dto.description !== undefined) template.description = dto.description || null;
    if (dto.triggerType !== undefined) template.triggerType = dto.triggerType;
    if (dto.stepsConfig !== undefined) template.stepsConfig = dto.stepsConfig as any;
    if (dto.isActive !== undefined) template.isActive = dto.isActive;

    // Increment version on every update to support workflow instance versioning
    template.version += 1;

    return this.templatesRepository.update(template);
  }

  async findActiveByTrigger(orgId: string, triggerType: string): Promise<WorkflowTemplateEntity | null> {
    return this.templatesRepository.findByOrgAndTrigger(orgId, triggerType);
  }
}
