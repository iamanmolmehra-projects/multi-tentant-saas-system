import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationChannel, NotificationRecipient, NotificationContent, DeliveryResult } from '../../dispatcher/interfaces/notification-channel.interface';
import { NotificationEntity } from '../../in-app/entities/notification.entity';

@Injectable()
export class InAppChannelService implements NotificationChannel {
  readonly channelName = 'in_app';
  private readonly logger = new Logger(InAppChannelService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
  ) {}

  async send(recipient: NotificationRecipient, content: NotificationContent): Promise<DeliveryResult> {
    await this.notifRepo.save(this.notifRepo.create({
      orgId: (content.metadata?.orgId as string) || '',
      userId: recipient.userId,
      eventType: (content.metadata?.eventType as string) || 'general',
      title: content.subject || 'Notification',
      body: content.body,
      actionUrl: content.actionUrl,
      metadata: content.metadata || {},
    }));
    this.logger.log(`[IN_APP] Stored for user: ${recipient.userId}`);
    return { success: true, provider: 'internal' };
  }
}
