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
import { PayrollCycleEntity } from '../../payroll-cycles/entities/payroll-cycle.entity';
import { PayslipEntity } from '../../payslips/entities/payslip.entity';

@Entity('payroll_runs')
export class PayrollRunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'cycle_id', type: 'uuid' })
  cycleId: string;

  @ManyToOne(() => PayrollCycleEntity, (cycle) => cycle.runs, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cycle_id' })
  cycle: PayrollCycleEntity;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;

  @Column({ name: 'total_gross', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalGross: number;

  @Column({ name: 'total_net', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalNet: number;

  @Column({ name: 'total_tax', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTax: number;

  @Column({ name: 'employee_count', type: 'int', default: 0 })
  employeeCount: number;

  @Column({ name: 'processed_by', type: 'uuid', nullable: true })
  processedBy: string | null;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'error_details', type: 'jsonb', nullable: true })
  errorDetails: Record<string, unknown> | null;

  @Column({ name: 'lock_key', type: 'varchar', length: 64, nullable: true, unique: true })
  lockKey: string | null;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 64, nullable: true, unique: true })
  idempotencyKey: string | null;

  @OneToMany(() => PayslipEntity, (payslip) => payslip.run)
  payslips: PayslipEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
