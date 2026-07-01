import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReportDefinitionEntity } from './report-definition.entity';

@Entity('report_schedules')
export class ReportScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'report_id', type: 'uuid' })
  reportId: string;

  @Column({ type: 'varchar', length: 20 })
  frequency: string;

  @Column({ name: 'day_of_week', type: 'int', nullable: true })
  dayOfWeek: number;

  @Column({ name: 'day_of_month', type: 'int', nullable: true })
  dayOfMonth: number;

  @Column({ name: 'time_of_day', type: 'time' })
  timeOfDay: string;

  @Column({ type: 'jsonb', nullable: true })
  recipients: string[];

  @Column({ name: 'export_format', type: 'varchar', length: 10, default: 'pdf' })
  exportFormat: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_run_at', type: 'timestamp', nullable: true })
  lastRunAt: Date;

  @Column({ name: 'next_run_at', type: 'timestamp', nullable: true })
  nextRunAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => ReportDefinitionEntity, (report) => report.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: ReportDefinitionEntity;
}
