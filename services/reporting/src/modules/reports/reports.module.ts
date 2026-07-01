import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportDefinitionEntity } from './entities/report-definition.entity';
import { ReportExecutionEntity } from './entities/report-execution.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ExportsModule } from '../exports/exports.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportDefinitionEntity, ReportExecutionEntity]), ExportsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
