import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExpenseEntity } from '../../expenses/entities/expense.entity';
import { ExpenseReportEntity } from '../../reports/entities/expense-report.entity';

@Entity('expense_approvals')
export class ApprovalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'expense_id', type: 'uuid', nullable: true })
  expenseId: string | null;

  @ManyToOne(() => ExpenseEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expense_id' })
  expense: ExpenseEntity | null;

  @Column({ name: 'report_id', type: 'uuid', nullable: true })
  reportId: string | null;

  @ManyToOne(() => ExpenseReportEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: ExpenseReportEntity | null;

  @Column({ name: 'approver_id', type: 'uuid' })
  approverId: string;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({ name: 'decided_at', type: 'timestamp', nullable: true })
  decidedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
