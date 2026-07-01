import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardWidgetEntity } from './entities/dashboard-widget.entity';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';
import { DataIngestionModule } from '../data-ingestion/data-ingestion.module';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardWidgetEntity]), DataIngestionModule],
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule {}
