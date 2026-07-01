import { Injectable } from '@nestjs/common';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionRepository } from './repositories/permission.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.findAll();
  }

  async findByModule(module: string): Promise<PermissionEntity[]> {
    return this.permissionRepository.findByModule(module);
  }

  async findByIds(ids: string[]): Promise<PermissionEntity[]> {
    return this.permissionRepository.findByIds(ids);
  }
}
