import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customers/entities/customer.entity';
import { InvoiceLineItemEntity } from './invoice-line-item.entity';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'invoice_number', type: 'varchar', length: 50, nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => CustomerEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ type: 'varchar', length: 30, default: 'draft' })
  status: string;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ name: 'amount_due', type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountDue: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 10, scale: 6, default: 1 })
  exchangeRate: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  terms: string | null;

  @Column({ name: 'pdf_url', type: 'text', nullable: true })
  pdfUrl: string | null;

  @Column({ name: 'recurring_id', type: 'uuid', nullable: true })
  recurringId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @VersionColumn()
  version: number;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @OneToMany(() => InvoiceLineItemEntity, (lineItem) => lineItem.invoice, {
    cascade: true,
    eager: true,
  })
  lineItems: InvoiceLineItemEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
