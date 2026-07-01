import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreferenceEntity } from './entities/notification-preference.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(NotificationPreferenceEntity)
    private readonly repo: Repository<NotificationPreferenceEntity>,
  ) {}

  async findByUser(userId: string, orgId: string): Promise<NotificationPreferenceEntity[]> {
    return this.repo.find({ where: { userId, orgId } });
  }

  async upsert(userId: string, orgId: string, data: Partial<NotificationPreferenceEntity>): Promise<NotificationPreferenceEntity> {
    const existing = await this.repo.findOne({ where: { userId, orgId, eventType: data.eventType } });
    if (existing) {
      Object.assign(existing, data);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ userId, orgId, ...data }));
  }
}
