import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('device_tokens')
export class DeviceTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  platform: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
