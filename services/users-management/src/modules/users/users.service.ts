import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IPaginatedResult } from '@multi-tenant/shared';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditService: AuditService,
  ) {}

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    orgId: string;
    roleId: string;
    parentId?: string;
  }): Promise<UserEntity> {
    return this.userRepository.create(data);
  }

  async create(
    orgId: string,
    dto: CreateUserDto,
    performedBy: string,
  ): Promise<UserEntity> {
    // Check uniqueness within org
    const existing = await this.userRepository.findByEmailAndOrg(dto.email, orgId);
    if (existing) {
      throw new ConflictException('Email already exists in this organization');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
      orgId,
      roleId: dto.roleId,
      parentId: dto.parentId || null,
    });

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: user.id,
      changes: { email: dto.email, roleId: dto.roleId },
    });

    return user;
  }

  async findAll(
    orgId: string,
    query: QueryUsersDto,
  ): Promise<IPaginatedResult<UserEntity>> {
    const [data, totalItems] = await this.userRepository.findAllByOrg(orgId, {
      page: query.page,
      limit: query.limit,
      isActive: query.isActive,
    });

    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findById(id: string, orgId: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id, orgId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByIdInternal(id: string): Promise<UserEntity | null> {
    return this.userRepository.findByIdInternal(id);
  }

  async findByEmailInternal(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailAndOrg(email: string, orgId: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmailAndOrg(email, orgId);
  }

  async update(
    id: string,
    orgId: string,
    dto: UpdateUserDto,
    performedBy: string,
  ): Promise<UserEntity> {
    const updateData: Partial<UserEntity> = {};
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.phone !== undefined) updateData.phone = dto.phone || null;
    if (dto.roleId) updateData.roleId = dto.roleId;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId || null;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const updated = await this.userRepository.update(id, orgId, updateData, dto.version);
    if (!updated) {
      throw new ConflictException(
        'Update failed due to concurrent modification. Please refresh and try again.',
      );
    }

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'USER_UPDATED',
      entityType: 'user',
      entityId: id,
      changes: updateData,
    });

    return updated;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.updateLastLogin(id);
  }

  async deactivate(id: string, orgId: string, performedBy: string): Promise<void> {
    const success = await this.userRepository.deactivate(id, orgId);
    if (!success) {
      throw new NotFoundException('User not found');
    }

    await this.auditService.log({
      orgId,
      userId: performedBy,
      action: 'USER_DEACTIVATED',
      entityType: 'user',
      entityId: id,
      changes: { isActive: false },
    });
  }

  async getSubordinates(parentId: string, orgId: string): Promise<UserEntity[]> {
    return this.userRepository.findSubordinates(parentId, orgId);
  }
}
