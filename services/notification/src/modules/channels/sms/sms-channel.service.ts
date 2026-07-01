import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationRecipient, NotificationContent, DeliveryResult } from '../../dispatcher/interfaces/notification-channel.interface';

@Injectable()
export class SmsChannelService implements NotificationChannel {
  readonly channelName = 'sms';
  private readonly logger = new Logger(SmsChannelService.name);

  async send(recipient: NotificationRecipient, content: NotificationContent): Promise<DeliveryResult> {
    if (!recipient.phone) {
      return { success: false, provider: 'twilio', error: 'No phone number provided' };
    }
    this.logger.log(`[SMS] To: ${recipient.phone} | Body: ${content.body.substring(0, 50)}...`);
    return { success: true, provider: 'twilio', providerMessageId: `sms-${Date.now()}` };
  }
}
