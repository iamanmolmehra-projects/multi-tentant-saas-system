import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplateEntity } from './entities/notification-template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(NotificationTemplateEntity)
    private readonly repo: Repository<NotificationTemplateEntity>,
  ) {}

  async findAll(): Promise<NotificationTemplateEntity[]> {
    return this.repo.find({ order: { eventType: 'ASC', channel: 'ASC' } });
  }

  async create(data: Partial<NotificationTemplateEntity>): Promise<NotificationTemplateEntity> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<NotificationTemplateEntity>): Promise<NotificationTemplateEntity> {
    const template = await this.repo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    Object.assign(template, data);
    return this.repo.save(template);
  }
}
