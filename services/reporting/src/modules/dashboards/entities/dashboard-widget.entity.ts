import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('dashboard_widgets')
export class DashboardWidgetEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId: string | null;
  @Column({ type: 'varchar', length: 100 }) name: string;
  @Column({ type: 'varchar', length: 50 }) type: string;
  @Column({ name: 'data_source', type: 'varchar', length: 50 }) dataSource: string;
  @Column({ type: 'jsonb' }) config: Record<string, unknown>;
  @Column({ type: 'jsonb', default: {} }) position: Record<string, unknown>;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
