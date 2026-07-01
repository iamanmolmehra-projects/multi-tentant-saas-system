"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
require("dotenv/config");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        cors: true,
    });
    const configService = app.get(config_1.ConfigService);
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.enableShutdownHooks();
    const apiPrefix = configService.get('APP_API_PREFIX', 'api');
    app.setGlobalPrefix(apiPrefix, { exclude: ['/health'] });
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Expense Management Service')
        .setDescription('Multi-tenant expense management, approvals, and reimbursement service')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addApiKey({ type: 'apiKey', name: 'x-service-api-key', in: 'header' }, 'service-api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = configService.get('APP_PORT', 3002);
    await app.listen(port);
    console.log(`Expense Management Service running on port ${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map