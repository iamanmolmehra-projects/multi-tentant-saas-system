import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from '../../instances/entities/workflow-instance.entity';
import { EscalationRuleEntity } from '../../rules/entities/escalation-rule.entity';

@Entity('workflow_templates')
export class WorkflowTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'trigger_type', type: 'varchar', length: 50 })
  triggerType: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ name: 'steps_config', type: 'jsonb' })
  stepsConfig: Record<string, any>[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => WorkflowInstanceEntity, (instance) => instance.template)
  instances: WorkflowInstanceEntity[];

  @OneToMany(() => EscalationRuleEntity, (rule) => rule.template)
  escalationRules: EscalationRuleEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
