import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowTemplateEntity } from './entities/workflow-template.entity';
import { TemplatesRepository } from './templates.repository';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowTemplateEntity])],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesRepository],
  exports: [TemplatesService, TemplatesRepository],
})
export class TemplatesModule {}
