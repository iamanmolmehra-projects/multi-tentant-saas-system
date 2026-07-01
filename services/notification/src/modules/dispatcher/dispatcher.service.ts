import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationChannelFactory } from './channel.factory';
import { NotificationPreferenceEntity } from '../preferences/entities/notification-preference.entity';
import { NotificationTemplateEntity } from '../templates/entities/notification-template.entity';
import { DeliveryLogEntity } from '../delivery/entities/delivery-log.entity';
import { NotificationContent, NotificationRecipient } from './interfaces/notification-channel.interface';

export interface DispatchRequest {
  eventId: string;
  eventType: string;
  orgId: string;
  userId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  data: Record<string, unknown>;
}

/**
 * Core dispatcher - receives notification requests and routes to appropriate channels
 * based on user preferences and template availability.
 */
@Injectable()
export class DispatcherService {
  private readonly logger = new Logger(DispatcherService.name);

  constructor(
    private readonly channelFactory: NotificationChannelFactory,
    @InjectRepository(NotificationPreferenceEntity)
    private readonly preferencesRepo: Repository<NotificationPreferenceEntity>,
    @InjectRepository(NotificationTemplateEntity)
    private readonly templatesRepo: Repository<NotificationTemplateEntity>,
    @InjectRepository(DeliveryLogEntity)
    private readonly deliveryRepo: Repository<DeliveryLogEntity>,
  ) {}

  async dispatch(request: DispatchRequest): Promise<void> {
    // Idempotency check via event_id
    const existing = await this.deliveryRepo.findOne({ where: { eventId: request.eventId } });
    if (existing) {
      this.logger.log(`Event ${request.eventId} already processed, skipping`);
      return;
    }

    // Get user preferences
    const preferences = await this.preferencesRepo.findOne({
      where: { userId: request.userId, eventType: request.eventType },
    });

    // Determine which channels to use
    const enabledChannels = this.resolveChannels(preferences);

    for (const channelType of enabledChannels) {
      // Find template for this event + channel
      const template = await this.templatesRepo.findOne({
        where: { eventType: request.eventType, channel: channelType, isActive: true },
      });

      if (!template) {
        this.logger.debug(`No template found for ${request.eventType}/${channelType}`);
        continue;
      }

      // Render template
      const content: NotificationContent = {
        subject: this.renderTemplate(template.subject || '', request.data),
        body: this.renderTemplate(template.bodyTemplate, request.data),
        metadata: request.data,
      };

      const recipient: NotificationRecipient = {
        userId: request.userId,
        email: request.recipientEmail,
        phone: request.recipientPhone,
      };

      // Get channel handler from factory
      const channel = this.channelFactory.getChannel(channelType);
      if (!channel) continue;

      try {
        const result = await channel.send(recipient, content);

        await this.deliveryRepo.save(this.deliveryRepo.create({
          orgId: request.orgId,
          userId: request.userId,
          channel: channelType,
          eventType: request.eventType,
          status: result.success ? 'sent' : 'failed',
          provider: result.provider,
          providerMessageId: result.providerMessageId,
          errorMessage: result.error,
          eventId: `${request.eventId}-${channelType}`,
          sentAt: result.success ? new Date() : null,
        }));
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to send via ${channelType}: ${msg}`);

        await this.deliveryRepo.save(this.deliveryRepo.create({
          orgId: request.orgId,
          userId: request.userId,
          channel: channelType,
          eventType: request.eventType,
          status: 'failed',
          errorMessage: msg,
          eventId: `${request.eventId}-${channelType}`,
          retryCount: 0,
        }));
      }
    }
  }

  private resolveChannels(preferences: NotificationPreferenceEntity | null): string[] {
    if (!preferences) {
      return ['email', 'in_app']; // defaults
    }
    const channels: string[] = [];
    if (preferences.emailEnabled) channels.push('email');
    if (preferences.smsEnabled) channels.push('sms');
    if (preferences.pushEnabled) channels.push('push');
    if (preferences.inAppEnabled) channels.push('in_app');
    return channels;
  }

  private renderTemplate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
  }
}
