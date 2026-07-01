import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { CategorySeedService } from './category-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  console.log('Running seeds...');

  await app.get(CategorySeedService).run();
  console.log('✓ Default expense categories seeded');

  console.log('Seeds completed successfully.');
  await app.close();
};

void runSeed();
