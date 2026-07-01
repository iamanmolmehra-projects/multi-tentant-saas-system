import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repo: Repository<RoleEntity>,
  ) {}

  async create(data: {
    name: string;
    description: string | null;
    orgId: string;
    isSystem: boolean;
    permissionIds: string[];
  }): Promise<RoleEntity> {
    const permissions = data.permissionIds.map((id) => ({ id } as PermissionEntity));

    const entity = this.repo.create({
      name: data.name,
      description: data.description,
      orgId: data.orgId,
      isSystem: data.isSystem,
      permissions,
    });

    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<RoleEntity | null> {
    return this.repo.findOne({
      where: [
        { id, orgId },
        { id, isSystem: true }, // System roles visible to all orgs
      ],
      relations: ['permissions'],
    });
  }

  async findByNameAndOrg(name: string, orgId: string): Promise<RoleEntity | null> {
    return this.repo.findOne({
      where: [
        { name, orgId },
        { name, isSystem: true },
      ],
      relations: ['permissions'],
    });
  }

  async findSystemRoleByName(name: string): Promise<RoleEntity | null> {
    return this.repo.findOne({
      where: { name, isSystem: true, orgId: IsNull() },
      relations: ['permissions'],
    });
  }

  async findAllByOrg(orgId: string): Promise<RoleEntity[]> {
    return this.repo.find({
      where: [
        { orgId },
        { isSystem: true }, // Include system roles
      ],
      relations: ['permissions'],
      order: { isSystem: 'DESC', name: 'ASC' },
    });
  }

  async update(
    id: string,
    orgId: string,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
      permissionIds?: string[];
    },
  ): Promise<RoleEntity | null> {
    const role = await this.repo.findOne({
      where: { id, orgId },
      relations: ['permissions'],
    });

    if (!role) return null;

    if (data.name) role.name = data.name;
    if (data.description !== undefined) role.description = data.description;
    if (data.isActive !== undefined) role.isActive = data.isActive;

    if (data.permissionIds) {
      role.permissions = data.permissionIds.map(
        (pid) => ({ id: pid } as PermissionEntity),
      );
    }

    return this.repo.save(role);
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.repo.delete({ id, orgId });
  }
}
