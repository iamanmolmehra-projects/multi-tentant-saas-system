import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_line_items')
export class InvoiceLineItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.lineItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountRate: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 2 })
  lineTotal: number;

  @Column({ name: 'hsn_code', type: 'varchar', length: 20, nullable: true })
  hsnCode: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
