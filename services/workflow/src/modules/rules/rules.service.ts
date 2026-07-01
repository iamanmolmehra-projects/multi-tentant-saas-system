import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EscalationRuleEntity } from './entities/escalation-rule.entity';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(EscalationRuleEntity)
    private readonly rulesRepo: Repository<EscalationRuleEntity>,
  ) {}

  async create(orgId: string, data: Partial<EscalationRuleEntity>): Promise<EscalationRuleEntity> {
    const entity = this.rulesRepo.create({ ...data, orgId });
    return this.rulesRepo.save(entity);
  }

  async findAllByTemplate(orgId: string, templateId: string): Promise<EscalationRuleEntity[]> {
    return this.rulesRepo.find({
      where: { orgId, templateId },
      order: { stepNumber: 'ASC' },
    });
  }

  async findById(id: string, orgId: string): Promise<EscalationRuleEntity> {
    const rule = await this.rulesRepo.findOne({ where: { id, orgId } });
    if (!rule) {
      throw new NotFoundException(`Escalation rule with id ${id} not found`);
    }
    return rule;
  }

  async update(id: string, orgId: string, data: Partial<EscalationRuleEntity>): Promise<EscalationRuleEntity> {
    const rule = await this.findById(id, orgId);
    Object.assign(rule, data);
    return this.rulesRepo.save(rule);
  }

  async delete(id: string, orgId: string): Promise<void> {
    const rule = await this.findById(id, orgId);
    await this.rulesRepo.remove(rule);
  }

  async findActiveByTemplateAndStep(templateId: string, stepNumber: number): Promise<EscalationRuleEntity | null> {
    return this.rulesRepo.findOne({
      where: { templateId, stepNumber, isActive: true },
    });
  }
}
