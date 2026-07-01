import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fact_invoices')
export class FactInvoiceEntity {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'customer_id', type: 'uuid', nullable: true }) customerId: string | null;
  @Column({ name: 'customer_name', type: 'varchar', length: 255, nullable: true }) customerName: string | null;
  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, nullable: true }) totalAmount: number | null;
  @Column({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, nullable: true }) amountPaid: number | null;
  @Column({ type: 'varchar', length: 30, nullable: true }) status: string | null;
  @Column({ name: 'issue_date', type: 'date' }) issueDate: Date;
  @Column({ name: 'due_date', type: 'date', nullable: true }) dueDate: Date | null;
  @Column({ name: 'paid_at', type: 'timestamp', nullable: true }) paidAt: Date | null;
  @Column({ type: 'varchar', length: 3, nullable: true }) currency: string | null;
  @Column({ name: 'created_at', type: 'timestamp', nullable: true }) createdAt: Date | null;
}
