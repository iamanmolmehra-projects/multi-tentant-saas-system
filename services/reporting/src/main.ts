import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true });
  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api'), { exclude: ['/health'] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const doc = new DocumentBuilder()
    .setTitle('Reporting Service')
    .setDescription('Analytics, dashboards, and report generation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, doc));

  const port = configService.get<number>('APP_PORT', 3007);
  await app.listen(port);
  console.log(`Reporting Service running on port ${port}`);
}
void bootstrap();
