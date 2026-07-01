import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tax_declarations')
export class TaxDeclarationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'financial_year', type: 'varchar', length: 10 })
  financialYear: string;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  regime: string;

  @Column({ type: 'jsonb' })
  declarations: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
