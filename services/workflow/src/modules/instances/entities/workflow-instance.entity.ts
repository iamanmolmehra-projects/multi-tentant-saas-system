import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkflowTemplateEntity } from '../../templates/entities/workflow-template.entity';
import { WorkflowStepEntity } from '../../steps/entities/workflow-step.entity';

@Entity('workflow_instances')
export class WorkflowInstanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @ManyToOne(() => WorkflowTemplateEntity, (template) => template.instances)
  @JoinColumn({ name: 'template_id' })
  template: WorkflowTemplateEntity;

  @Column({ name: 'template_version', type: 'int' })
  templateVersion: number;

  @Column({ name: 'trigger_entity_type', type: 'varchar', length: 50 })
  triggerEntityType: string;

  @Column({ name: 'trigger_entity_id', type: 'uuid' })
  triggerEntityId: string;

  @Column({ name: 'initiated_by', type: 'uuid' })
  initiatedBy: string;

  @Column({ type: 'varchar', length: 30, default: 'active' })
  status: string;

  @Column({ name: 'current_step', type: 'int', default: 1 })
  currentStep: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => WorkflowStepEntity, (step) => step.instance, { cascade: true })
  steps: WorkflowStepEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
