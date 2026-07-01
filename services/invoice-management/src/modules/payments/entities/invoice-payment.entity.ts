import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';

@Entity('invoice_payments')
export class InvoicePaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @ManyToOne(() => InvoiceEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod: string | null;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({ name: 'reference_number', type: 'varchar', length: 255, nullable: true })
  referenceNumber: string | null;

  @Column({ name: 'gateway_ref', type: 'varchar', length: 255, nullable: true })
  gatewayRef: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 64, unique: true })
  idempotencyKey: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
