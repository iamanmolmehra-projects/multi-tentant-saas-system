import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), AuditModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService, RoleRepository],
})
export class RolesModule {}
