import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100 })
  module: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
