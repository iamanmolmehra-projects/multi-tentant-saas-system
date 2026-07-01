/**
 * Interface for all notification channels.
 * Implements the Strategy pattern — each channel provides its own delivery logic.
 */
export interface NotificationChannel {
  readonly channelName: string;
  send(recipient: NotificationRecipient, content: NotificationContent): Promise<DeliveryResult>;
}

export interface NotificationRecipient {
  userId: string;
  email?: string;
  phone?: string;
  deviceTokens?: string[];
}

export interface NotificationContent {
  subject?: string;
  body: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface DeliveryResult {
  success: boolean;
  provider: string;
  providerMessageId?: string;
  error?: string;
}
