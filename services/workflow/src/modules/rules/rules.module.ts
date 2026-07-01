import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscalationRuleEntity } from './entities/escalation-rule.entity';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EscalationRuleEntity])],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
