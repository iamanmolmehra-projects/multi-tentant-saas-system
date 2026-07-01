import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  console.log('Running seeds...');

  // Add seed services here as needed
  // await app.get(SomeService).run();

  console.log('Seeds completed successfully.');
  await app.close();
};

void runSeed();
