import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepository],
  exports: [PermissionsService, PermissionRepository],
})
export class PermissionsModule {}
