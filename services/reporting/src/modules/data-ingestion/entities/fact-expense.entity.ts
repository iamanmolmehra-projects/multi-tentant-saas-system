import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fact_expenses')
export class FactExpenseEntity {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'category_id', type: 'uuid', nullable: true }) categoryId: string | null;
  @Column({ name: 'category_name', type: 'varchar', length: 100, nullable: true }) categoryName: string | null;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) amount: number;
  @Column({ type: 'varchar', length: 3, nullable: true }) currency: string | null;
  @Column({ type: 'varchar', length: 30, nullable: true }) status: string | null;
  @Column({ name: 'expense_date', type: 'date' }) expenseDate: Date;
  @Column({ name: 'approved_at', type: 'timestamp', nullable: true }) approvedAt: Date | null;
  @Column({ name: 'created_at', type: 'timestamp', nullable: true }) createdAt: Date | null;
}
