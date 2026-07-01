import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fact_payroll')
export class FactPayrollEntity {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'period_start', type: 'date' }) periodStart: Date;
  @Column({ name: 'period_end', type: 'date' }) periodEnd: Date;
  @Column({ name: 'gross_salary', type: 'decimal', precision: 15, scale: 2, nullable: true }) grossSalary: number | null;
  @Column({ name: 'net_salary', type: 'decimal', precision: 15, scale: 2, nullable: true }) netSalary: number | null;
  @Column({ name: 'total_tax', type: 'decimal', precision: 15, scale: 2, nullable: true }) totalTax: number | null;
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true }) reimbursements: number | null;
  @Column({ name: 'created_at', type: 'timestamp', nullable: true }) createdAt: Date | null;
}
