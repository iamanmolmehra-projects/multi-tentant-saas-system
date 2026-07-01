import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from './interfaces/notification-channel.interface';
import { EmailChannelService } from '../channels/email/email-channel.service';
import { SmsChannelService } from '../channels/sms/sms-channel.service';
import { PushChannelService } from '../channels/push/push-channel.service';
import { InAppChannelService } from '../channels/in-app-channel/in-app-channel.service';

/**
 * Factory pattern: Creates the appropriate notification channel handler
 * based on the channel type string. Allows adding new channels without
 * modifying existing dispatch logic.
 */
@Injectable()
export class NotificationChannelFactory {
  private readonly logger = new Logger(NotificationChannelFactory.name);
  private readonly channelMap: Map<string, NotificationChannel>;

  constructor(
    private readonly emailChannel: EmailChannelService,
    private readonly smsChannel: SmsChannelService,
    private readonly pushChannel: PushChannelService,
    private readonly inAppChannel: InAppChannelService,
  ) {
    this.channelMap = new Map<string, NotificationChannel>();
    this.channelMap.set('email', this.emailChannel);
    this.channelMap.set('sms', this.smsChannel);
    this.channelMap.set('push', this.pushChannel);
    this.channelMap.set('in_app', this.inAppChannel);
  }

  getChannel(channelType: string): NotificationChannel | null {
    const channel = this.channelMap.get(channelType);
    if (!channel) {
      this.logger.warn(`No channel handler found for type: ${channelType}`);
      return null;
    }
    return channel;
  }

  getAllChannels(): string[] {
    return Array.from(this.channelMap.keys());
  }
}
