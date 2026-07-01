import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class InAppService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async findByUser(userId: string, orgId: string, page: number, limit: number) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId, orgId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUnreadCount(userId: string, orgId: string): Promise<{ count: number }> {
    const count = await this.repo.count({ where: { userId, orgId, isRead: false } });
    return { count };
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.repo.update({ id, userId }, { isRead: true, readAt: new Date() });
  }

  async markAllRead(userId: string, orgId: string): Promise<void> {
    await this.repo.update({ userId, orgId, isRead: false }, { isRead: true, readAt: new Date() });
  }
}
