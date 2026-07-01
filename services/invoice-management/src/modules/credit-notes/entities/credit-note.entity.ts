import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';

@Entity('credit_notes')
export class CreditNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @ManyToOne(() => InvoiceEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Column({ name: 'credit_number', type: 'varchar', length: 50 })
  creditNumber: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'varchar', length: 20, default: 'issued' })
  status: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
