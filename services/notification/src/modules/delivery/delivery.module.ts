import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryLogEntity } from './entities/delivery-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryLogEntity])],
  exports: [TypeOrmModule],
})
export class DeliveryModule {}
