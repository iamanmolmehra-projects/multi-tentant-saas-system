import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'org_id' })
  organization: OrganizationEntity;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @ManyToOne(() => RoleEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.subordinates, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: UserEntity | null;

  @OneToMany(() => UserEntity, (user) => user.parent)
  subordinates: UserEntity[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @VersionColumn({ default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
