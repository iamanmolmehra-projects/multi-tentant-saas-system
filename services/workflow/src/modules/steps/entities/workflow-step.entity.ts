import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from '../../instances/entities/workflow-instance.entity';

@Entity('workflow_steps')
export class WorkflowStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'instance_id', type: 'uuid' })
  instanceId: string;

  @ManyToOne(() => WorkflowInstanceEntity, (instance) => instance.steps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instance_id' })
  instance: WorkflowInstanceEntity;

  @Column({ name: 'step_number', type: 'int' })
  stepNumber: number;

  @Column({ name: 'approver_type', type: 'varchar', length: 30 })
  approverType: string;

  @Column({ name: 'approver_id', type: 'uuid', nullable: true })
  approverId: string | null;

  @Column({ name: 'approver_role', type: 'varchar', length: 50, nullable: true })
  approverRole: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({ name: 'sla_hours', type: 'int', nullable: true })
  slaHours: number | null;

  @Column({ name: 'escalate_to', type: 'uuid', nullable: true })
  escalateTo: string | null;

  @Column({ name: 'decided_at', type: 'timestamp', nullable: true })
  decidedAt: Date | null;

  @Column({ name: 'due_at', type: 'timestamp', nullable: true })
  dueAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
