import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity]), AuditModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationRepository],
  exports: [OrganizationsService, OrganizationRepository],
})
export class OrganizationsModule {}
