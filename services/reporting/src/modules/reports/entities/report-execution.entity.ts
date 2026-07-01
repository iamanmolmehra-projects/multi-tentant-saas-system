import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportDefinitionEntity } from './report-definition.entity';

@Entity('report_executions')
export class ReportExecutionEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'report_id', type: 'uuid' }) reportId: string;
  @ManyToOne(() => ReportDefinitionEntity) @JoinColumn({ name: 'report_id' }) report: ReportDefinitionEntity;
  @Column({ type: 'varchar', length: 20, default: 'pending' }) status: string;
  @Column({ type: 'jsonb', nullable: true }) parameters: Record<string, unknown> | null;
  @Column({ name: 'result_url', type: 'text', nullable: true }) resultUrl: string | null;
  @Column({ name: 'row_count', type: 'int', nullable: true }) rowCount: number | null;
  @Column({ name: 'started_at', type: 'timestamp', nullable: true }) startedAt: Date | null;
  @Column({ name: 'completed_at', type: 'timestamp', nullable: true }) completedAt: Date | null;
  @Column({ name: 'error_message', type: 'text', nullable: true }) errorMessage: string | null;
  @Column({ name: 'triggered_by', type: 'varchar', length: 20, default: 'user' }) triggeredBy: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
