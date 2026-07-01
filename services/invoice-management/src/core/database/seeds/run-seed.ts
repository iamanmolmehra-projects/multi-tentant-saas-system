import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { NumberingSeedService } from './numbering-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  console.log('Running seeds...');

  await app.get(NumberingSeedService).run();
  console.log('✓ Default invoice numbering config seeded');

  console.log('Seeds completed successfully.');
  await app.close();
};

void runSeed();
