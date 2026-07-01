import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowStepEntity } from './entities/workflow-step.entity';
import { WorkflowInstanceEntity } from '../instances/entities/workflow-instance.entity';
import { StepsRepository } from './steps.repository';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStepEntity, WorkflowInstanceEntity])],
  controllers: [StepsController],
  providers: [StepsService, StepsRepository],
  exports: [StepsService, StepsRepository],
})
export class StepsModule {}
