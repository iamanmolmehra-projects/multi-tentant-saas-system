import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditService } from '../audit/audit.service';
import { RoleEnum } from '@multi-tenant/shared';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditService: AuditService,
  ) {}

  async create(orgId: string, dto: CreateRoleDto, performedBy: string): Promise<RoleEntity> {
    // Idempotency: check if role name exists in org
    const existing = await this.roleRepository.findByNameAndOrg(dto.name, orgId);
    if (existing) {
      throw new ConflictException(`Role '${dto.name}' already exists in this organization`);
    }

    const role = await this.roleRepository.create({
      name: dto.name,
      description: dto.description || null,
      orgId,
      isSystem: false,
      permissionIds: dto.permissionIds,
    });

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'ROLE_CREATED',
      entityType: 'role',
      entityId: role.id,
      changes: { name: dto.name, permissionIds: dto.permissionIds },
    });

    return role;
  }

  async findAllByOrg(orgId: string): Promise<RoleEntity[]> {
    return this.roleRepository.findAllByOrg(orgId);
  }

  async findById(id: string, orgId: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findById(id, orgId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async findDefaultRole(orgId: string): Promise<RoleEntity> {
    // First try org-specific employee role, then system employee role
    let role = await this.roleRepository.findByNameAndOrg(RoleEnum.EMPLOYEE, orgId);
    if (!role) {
      role = await this.roleRepository.findSystemRoleByName(RoleEnum.EMPLOYEE);
    }
    if (!role) {
      throw new NotFoundException('Default role not configured');
    }
    return role;
  }

  async update(
    id: string,
    orgId: string,
    dto: UpdateRoleDto,
    performedBy: string,
  ): Promise<RoleEntity> {
    const role = await this.findById(id, orgId);

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be modified');
    }

    const updated = await this.roleRepository.update(id, orgId, {
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive,
      permissionIds: dto.permissionIds,
    });

    if (!updated) {
      throw new NotFoundException('Role not found');
    }

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'ROLE_UPDATED',
      entityType: 'role',
      entityId: id,
      changes: dto,
    });

    return updated;
  }

  async delete(id: string, orgId: string, performedBy: string): Promise<void> {
    const role = await this.findById(id, orgId);

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted');
    }

    await this.roleRepository.delete(id, orgId);

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'ROLE_DELETED',
      entityType: 'role',
      entityId: id,
      changes: null,
    });
  }
}
