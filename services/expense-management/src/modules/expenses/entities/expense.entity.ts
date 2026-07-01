import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'report_id', type: 'uuid', nullable: true })
  reportId: string | null;

  @ManyToOne(() => ExpenseReportEntity, (report) => report.expenses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'report_id' })
  report: ExpenseReportEntity | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ name: 'merchant_name', type: 'varchar', length: 255, nullable: true })
  merchantName: string | null;

  @Column({ name: 'receipt_url', type: 'text', nullable: true })
  receiptUrl: string | null;

  @Column({ name: 'receipt_metadata', type: 'jsonb', nullable: true })
  receiptMetadata: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 30, default: 'draft' })
  status: string;

  @Column({ name: 'policy_violation', type: 'varchar', length: 500, nullable: true })
  policyViolation: string | null;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 64, nullable: true, unique: true })
  idempotencyKey: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
