import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery_logs')
export class DeliveryLogEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'org_id', type: 'uuid' }) orgId: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ type: 'varchar', length: 20 }) channel: string;
  @Column({ name: 'event_type', type: 'varchar', length: 100 }) eventType: string;
  @Column({ type: 'varchar', length: 20 }) status: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) provider: string | null;
  @Column({ name: 'provider_message_id', type: 'varchar', length: 255, nullable: true }) providerMessageId: string | null;
  @Column({ name: 'error_message', type: 'text', nullable: true }) errorMessage: string | null;
  @Column({ name: 'retry_count', type: 'int', default: 0 }) retryCount: number;
  @Column({ name: 'event_id', type: 'varchar', length: 64, unique: true, nullable: true }) eventId: string | null;
  @Column({ name: 'sent_at', type: 'timestamp', nullable: true }) sentAt: Date | null;
  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true }) deliveredAt: Date | null;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
