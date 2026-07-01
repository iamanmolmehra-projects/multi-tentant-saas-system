import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowInstanceEntity } from './entities/workflow-instance.entity';
import { InstancesRepository } from './instances.repository';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { TemplatesModule } from '../templates/templates.module';
import { ApproverResolutionModule } from '../approver-resolution/approver-resolution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowInstanceEntity]),
    TemplatesModule,
    ApproverResolutionModule,
  ],
  controllers: [InstancesController],
  providers: [InstancesService, InstancesRepository],
  exports: [InstancesService, InstancesRepository],
})
export class InstancesModule {}
