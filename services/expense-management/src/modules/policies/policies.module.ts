import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyRepository } from './repositories/policy.repository';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity])],
  controllers: [PoliciesController],
  providers: [PoliciesService, PolicyRepository],
  exports: [PoliciesService, PolicyRepository],
})
export class PoliciesModule {}
