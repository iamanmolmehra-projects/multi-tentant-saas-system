import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplateEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string | null;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ name: 'event_type', type: 'varchar', length: 100 }) eventType: string;
  @Column({ type: 'varchar', length: 20 }) channel: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) subject: string | null;
  @Column({ name: 'body_template', type: 'text' }) bodyTemplate: string;
  @Column({ type: 'jsonb', default: [] }) variables: string[];
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
