import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repo: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    return this.repo.find({ order: { module: 'ASC', action: 'ASC' } });
  }

  async findByModule(module: string): Promise<PermissionEntity[]> {
    return this.repo.find({ where: { module }, order: { action: 'ASC' } });
  }

  async findByIds(ids: string[]): Promise<PermissionEntity[]> {
    if (ids.length === 0) return [];
    return this.repo.find({ where: { id: In(ids) } });
  }

  async findByName(name: string): Promise<PermissionEntity | null> {
    return this.repo.findOne({ where: { name } });
  }

  async createIfNotExists(data: {
    name: string;
    description: string;
    module: string;
    action: string;
  }): Promise<PermissionEntity> {
    const existing = await this.findByName(data.name);
    if (existing) return existing;

    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
