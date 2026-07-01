import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  const apiPrefix = configService.get<string>('APP_API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix, { exclude: ['/health'] });

  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Invoice Management Service')
    .setDescription('Multi-tenant invoice management, billing, and payment tracking service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'x-service-api-key', in: 'header' },
      'service-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('APP_PORT', 3005);
  await app.listen(port);

  console.log(`Invoice Management Service running on port ${port}`);
}

void bootstrap();
