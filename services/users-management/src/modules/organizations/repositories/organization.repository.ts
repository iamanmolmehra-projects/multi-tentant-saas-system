import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly repo: Repository<OrganizationEntity>,
  ) {}

  async create(data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async findChildren(parentId: string): Promise<OrganizationEntity[]> {
    return this.repo.find({ where: { parentId } });
  }

  async update(
    id: string,
    data: Partial<OrganizationEntity>,
  ): Promise<OrganizationEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deactivate(id: string): Promise<boolean> {
    const result = await this.repo.update(id, { isActive: false });
    return (result.affected ?? 0) > 0;
  }
}
