import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  console.log('Running payroll seeds...');

  // Add seed services here as needed
  // Example: await app.get(SomeSeedService).run();

  console.log('Payroll seeds completed successfully.');
  await app.close();
};

void runSeed();
