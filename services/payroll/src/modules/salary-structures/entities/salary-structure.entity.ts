import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('salary_structures')
export class SalaryStructureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'base_salary', type: 'decimal', precision: 15, scale: 2 })
  baseSalary: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'jsonb' })
  components: Record<string, number>;

  @Column({ type: 'jsonb', default: {} })
  deductions: Record<string, number>;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date | null;

  @Column({ name: 'is_current', type: 'boolean', default: true })
  isCurrent: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
