import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PayrollRunEntity } from '../../payroll-runs/entities/payroll-run.entity';

@Entity('payroll_reimbursements')
export class PayrollReimbursementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'expense_report_id', type: 'uuid' })
  expenseReportId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;

  @Column({ name: 'included_in_run_id', type: 'uuid', nullable: true })
  includedInRunId: string | null;

  @ManyToOne(() => PayrollRunEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'included_in_run_id' })
  includedInRun: PayrollRunEntity | null;

  @Column({ name: 'event_id', type: 'varchar', length: 64, unique: true })
  eventId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
