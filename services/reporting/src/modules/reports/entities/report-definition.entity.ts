import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('report_definitions')
export class ReportDefinitionEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ type: 'varchar', length: 50 }) type: string;
  @Column({ type: 'jsonb' }) config: Record<string, unknown>;
  @Column({ type: 'varchar', length: 20, default: 'private' }) visibility: string;
  @Column({ name: 'allowed_roles', type: 'jsonb', default: [] }) allowedRoles: string[];
  @Column({ name: 'created_by', type: 'uuid' }) createdBy: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
