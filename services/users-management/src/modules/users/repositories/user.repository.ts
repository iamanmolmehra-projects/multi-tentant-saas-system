import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

/**
 * Repository layer for user persistence.
 * All queries are scoped by orgId for tenant isolation.
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['role', 'role.permissions', 'organization'],
    });
  }

  async findByIdInternal(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });
  }

  async findByEmailAndOrg(email: string, orgId: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { email, orgId },
      relations: ['role', 'role.permissions'],
    });
  }

  async findAllByOrg(
    orgId: string,
    options: { page: number; limit: number; isActive?: boolean },
  ): Promise<[UserEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.org_id = :orgId', { orgId });

    if (options.isActive !== undefined) {
      qb.andWhere('user.is_active = :isActive', { isActive: options.isActive });
    }

    qb.skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('user.created_at', 'DESC');

    return qb.getManyAndCount();
  }

  async findSubordinates(parentId: string, orgId: string): Promise<UserEntity[]> {
    return this.repo.find({
      where: { parentId, orgId },
      relations: ['role'],
    });
  }

  /**
   * Optimistic locking update - uses version column for concurrency control.
   */
  async update(
    id: string,
    orgId: string,
    data: Partial<UserEntity>,
    expectedVersion: number,
  ): Promise<UserEntity | null> {
    const result = await this.repo
      .createQueryBuilder()
      .update(UserEntity)
      .set({ ...data, version: expectedVersion + 1 })
      .where('id = :id AND org_id = :orgId AND version = :expectedVersion', {
        id,
        orgId,
        expectedVersion,
      })
      .execute();

    if (result.affected === 0) {
      return null; // Concurrent modification detected
    }

    return this.findById(id, orgId);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repo.update(id, { lastLoginAt: new Date() });
  }

  async deactivate(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.update(
      { id, orgId },
      { isActive: false },
    );
    return (result.affected ?? 0) > 0;
  }

  async countByOrg(orgId: string): Promise<number> {
    return this.repo.count({ where: { orgId } });
  }
}
