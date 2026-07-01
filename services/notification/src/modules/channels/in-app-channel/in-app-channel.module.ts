import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InAppChannelService } from './in-app-channel.service';
import { NotificationEntity } from '../../in-app/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [InAppChannelService],
  exports: [InAppChannelService],
})
export class InAppChannelModule {}
