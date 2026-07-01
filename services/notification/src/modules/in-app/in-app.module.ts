import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { InAppController } from './in-app.controller';
import { InAppService } from './in-app.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [InAppController],
  providers: [InAppService],
  exports: [InAppService],
})
export class InAppModule {}
