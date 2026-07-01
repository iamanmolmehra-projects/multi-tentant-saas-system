import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { PermissionSeedService } from './permission-seed.service';
import { RoleSeedService } from './role-seed.service';
import { OrganizationSeedService } from './organization-seed.service';
import { UserSeedService } from './user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  console.log('Running seeds...');

  // Order matters: permissions -> roles -> orgs -> users
  await app.get(PermissionSeedService).run();
  console.log('✓ Permissions seeded');

  await app.get(RoleSeedService).run();
  console.log('✓ Roles seeded');

  await app.get(OrganizationSeedService).run();
  console.log('✓ Organizations seeded');

  await app.get(UserSeedService).run();
  console.log('✓ Users seeded');

  console.log('Seeds completed successfully.');
  await app.close();
};

void runSeed();
