import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplateEntity } from './entities/notification-template.entity';

@Injectable()
export class TemplatesRepository {
  constructor(
    @InjectRepository(NotificationTemplateEntity)
    private readonly repo: Repository<NotificationTemplateEntity>,
  ) {}

  async findAll(orgId: string): Promise<NotificationTemplateEntity[]> {
    return this.repo.find({
      where: [{ orgId }, { orgId: null as any }],
      order: { eventType: 'ASC', channel: 'ASC' },
    });
  }

  async findById(id: string): Promise<NotificationTemplateEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEventAndChannel(
    eventType: string,
    channel: string,
    orgId?: string,
  ): Promise<NotificationTemplateEntity | null> {
    // Prefer org-specific template, fall back to global
    const orgTemplate = orgId
      ? await this.repo.findOne({ where: { eventType, channel, orgId, isActive: true } })
      : null;

    if (orgTemplate) return orgTemplate;

    return this.repo.findOne({
      where: { eventType, channel, orgId: null as any, isActive: true },
    });
  }

  async create(data: Partial<NotificationTemplateEntity>): Promise<NotificationTemplateEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    data: Partial<NotificationTemplateEntity>,
  ): Promise<NotificationTemplateEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }
}
