import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_preferences')
export class NotificationPreferenceEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'event_type', type: 'varchar', length: 100 }) eventType: string;
  @Column({ name: 'email_enabled', type: 'boolean', default: true }) emailEnabled: boolean;
  @Column({ name: 'sms_enabled', type: 'boolean', default: false }) smsEnabled: boolean;
  @Column({ name: 'push_enabled', type: 'boolean', default: true }) pushEnabled: boolean;
  @Column({ name: 'in_app_enabled', type: 'boolean', default: true }) inAppEnabled: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
