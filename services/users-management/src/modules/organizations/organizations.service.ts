import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly orgRepository: OrganizationRepository,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateOrganizationDto, performedBy: string): Promise<OrganizationEntity> {
    // Idempotency: check if slug already exists
    const existing = await this.orgRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Organization with slug '${dto.slug}' already exists`);
    }

    const org = await this.orgRepository.create({
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parentId || null,
      settings: dto.settings || {},
    });

    await this.auditService.log({
      orgId: org.id,
      userId: performedBy,
      action: 'ORG_CREATED',
      entityType: 'organization',
      entityId: org.id,
      changes: { name: dto.name, slug: dto.slug },
    });

    return org;
  }

  async findById(id: string): Promise<OrganizationEntity> {
    const org = await this.orgRepository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
    performedBy: string,
  ): Promise<OrganizationEntity> {
    const org = await this.findById(id);

    const updated = await this.orgRepository.update(org.id, dto);
    if (!updated) {
      throw new NotFoundException('Organization not found');
    }

    await this.auditService.log({
      orgId: id,
      userId: performedBy,
      action: 'ORG_UPDATED',
      entityType: 'organization',
      entityId: id,
      changes: dto,
    });

    return updated;
  }

  async getChildren(parentId: string): Promise<OrganizationEntity[]> {
    return this.orgRepository.findChildren(parentId);
  }
}
