import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('expense_policies')
export class PolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity | null;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId: string | null;

  @Column({ name: 'max_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxAmount: number | null;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  period: string | null;

  @Column({
    name: 'requires_receipt_above',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  requiresReceiptAbove: number | null;

  @Column({
    name: 'auto_approve_below',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  autoApproveBelow: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
