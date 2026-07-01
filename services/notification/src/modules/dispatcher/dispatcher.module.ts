import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatcherService } from './dispatcher.service';
import { NotificationChannelFactory } from './channel.factory';
import { NotificationPreferenceEntity } from '../preferences/entities/notification-preference.entity';
import { NotificationTemplateEntity } from '../templates/entities/notification-template.entity';
import { DeliveryLogEntity } from '../delivery/entities/delivery-log.entity';
import { EmailChannelModule } from '../channels/email/email-channel.module';
import { SmsChannelModule } from '../channels/sms/sms-channel.module';
import { PushChannelModule } from '../channels/push/push-channel.module';
import { InAppChannelModule } from '../channels/in-app-channel/in-app-channel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreferenceEntity, NotificationTemplateEntity, DeliveryLogEntity]),
    EmailChannelModule,
    SmsChannelModule,
    PushChannelModule,
    InAppChannelModule,
  ],
  providers: [DispatcherService, NotificationChannelFactory],
  exports: [DispatcherService],
})
export class DispatcherModule {}
