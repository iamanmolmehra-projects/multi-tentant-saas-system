import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationChannel, NotificationRecipient, NotificationContent, DeliveryResult } from '../../dispatcher/interfaces/notification-channel.interface';

@Injectable()
export class EmailChannelService implements NotificationChannel {
  readonly channelName = 'email';
  private readonly logger = new Logger(EmailChannelService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(recipient: NotificationRecipient, content: NotificationContent): Promise<DeliveryResult> {
    if (!recipient.email) {
      return { success: false, provider: 'smtp', error: 'No email address provided' };
    }

    // In production, this would call AWS SES / SendGrid / SMTP
    this.logger.log(`[EMAIL] To: ${recipient.email} | Subject: ${content.subject}`);

    // Simulated success
    return {
      success: true,
      provider: this.configService.get('SMTP_HOST', 'smtp'),
      providerMessageId: `email-${Date.now()}`,
    };
  }
}
