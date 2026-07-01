import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('invoice_numbering')
export class InvoiceNumberingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid', unique: true })
  orgId: string;

  @Column({ type: 'varchar', length: 20, default: 'INV' })
  prefix: string;

  @Column({ type: 'varchar', length: 5, default: '-' })
  separator: string;

  @Column({ name: 'current_number', type: 'bigint', default: 0 })
  currentNumber: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  format: string | null;

  @Column({ type: 'int', default: 5 })
  padding: number;

  @Column({ name: 'financial_year_reset', type: 'boolean', default: true })
  financialYearReset: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
