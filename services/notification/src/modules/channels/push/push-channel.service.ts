import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationRecipient, NotificationContent, DeliveryResult } from '../../dispatcher/interfaces/notification-channel.interface';

@Injectable()
export class PushChannelService implements NotificationChannel {
  readonly channelName = 'push';
  private readonly logger = new Logger(PushChannelService.name);

  async send(recipient: NotificationRecipient, content: NotificationContent): Promise<DeliveryResult> {
    if (!recipient.deviceTokens || recipient.deviceTokens.length === 0) {
      return { success: false, provider: 'fcm', error: 'No device tokens' };
    }
    this.logger.log(`[PUSH] To: ${recipient.userId} (${recipient.deviceTokens.length} devices) | Title: ${content.subject}`);
    return { success: true, provider: 'fcm', providerMessageId: `push-${Date.now()}` };
  }
}
