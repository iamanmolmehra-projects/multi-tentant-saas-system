import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PayrollRunEntity } from '../../payroll-runs/entities/payroll-run.entity';

@Entity('payslips')
export class PayslipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'run_id', type: 'uuid' })
  runId: string;

  @ManyToOne(() => PayrollRunEntity, (run) => run.payslips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'run_id' })
  run: PayrollRunEntity;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'gross_salary', type: 'decimal', precision: 15, scale: 2 })
  grossSalary: number;

  @Column({ name: 'net_salary', type: 'decimal', precision: 15, scale: 2 })
  netSalary: number;

  @Column({ type: 'jsonb' })
  components: Record<string, number>;

  @Column({ type: 'jsonb' })
  deductions: Record<string, number>;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  reimbursements: number;

  @Column({ name: 'ytd_gross', type: 'decimal', precision: 15, scale: 2, default: 0 })
  ytdGross: number;

  @Column({ name: 'ytd_tax', type: 'decimal', precision: 15, scale: 2, default: 0 })
  ytdTax: number;

  @Column({ name: 'pdf_url', type: 'text', nullable: true })
  pdfUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
