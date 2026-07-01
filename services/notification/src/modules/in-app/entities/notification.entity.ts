import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'event_type', type: 'varchar', length: 100 }) eventType: string;
  @Column({ type: 'varchar', length: 255 }) title: string;
  @Column({ type: 'text', nullable: true }) body: string | null;
  @Column({ name: 'action_url', type: 'varchar', length: 500, nullable: true }) actionUrl: string | null;
  @Column({ name: 'is_read', type: 'boolean', default: false }) isRead: boolean;
  @Column({ name: 'read_at', type: 'timestamp', nullable: true }) readAt: Date | null;
  @Column({ type: 'jsonb', default: {} }) metadata: Record<string, unknown>;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
