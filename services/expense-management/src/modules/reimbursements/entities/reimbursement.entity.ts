import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';

@Entity('reimbursements')
export class ReimbursementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'report_id', type: 'uuid' })
  reportId: string;

  @ManyToOne(() => ExpenseReportEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: ExpenseReportEntity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;

  @Column({ name: 'payroll_ref', type: 'varchar', length: 255, nullable: true })
  payrollRef: string | null;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
