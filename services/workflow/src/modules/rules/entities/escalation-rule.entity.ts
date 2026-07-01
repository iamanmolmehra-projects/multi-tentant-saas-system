import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowTemplateEntity } from '../../templates/entities/workflow-template.entity';

@Entity('escalation_rules')
export class EscalationRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @ManyToOne(() => WorkflowTemplateEntity, (template) => template.escalationRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: WorkflowTemplateEntity;

  @Column({ name: 'step_number', type: 'int' })
  stepNumber: number;

  @Column({ name: 'hours_before_escalation', type: 'int', default: 48 })
  hoursBeforeEscalation: number;

  @Column({ name: 'escalate_to_type', type: 'varchar', length: 30 })
  escalateToType: string;

  @Column({ name: 'escalate_to_value', type: 'varchar', length: 255 })
  escalateToValue: string;

  @Column({ name: 'notify_on_escalation', type: 'boolean', default: true })
  notifyOnEscalation: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
