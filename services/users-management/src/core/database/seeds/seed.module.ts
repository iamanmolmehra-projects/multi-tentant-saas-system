import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from '../typeorm-config.service';
import { PermissionEntity } from '../../../modules/permissions/entities/permission.entity';
import { RoleEntity } from '../../../modules/roles/entities/role.entity';
import { OrganizationEntity } from '../../../modules/organizations/entities/organization.entity';
import { UserEntity } from '../../../modules/users/entities/user.entity';

import { PermissionSeedService } from './permission-seed.service';
import { RoleSeedService } from './role-seed.service';
import { OrganizationSeedService } from './organization-seed.service';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),
    TypeOrmModule.forFeature([
      PermissionEntity,
      RoleEntity,
      OrganizationEntity,
      UserEntity,
    ]),
  ],
  providers: [
    PermissionSeedService,
    RoleSeedService,
    OrganizationSeedService,
    UserSeedService,
  ],
})
export class SeedModule {}
