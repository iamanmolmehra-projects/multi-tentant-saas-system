import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customers/entities/customer.entity';

@Entity('recurring_invoices')
export class RecurringInvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => CustomerEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ type: 'varchar', length: 20 })
  frequency: string;

  @Column({ name: 'next_issue_date', type: 'date', nullable: true })
  nextIssueDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ name: 'line_items', type: 'jsonb', nullable: true })
  lineItems: Record<string, unknown>[] | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  terms: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_generated_at', type: 'timestamp', nullable: true })
  lastGeneratedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
