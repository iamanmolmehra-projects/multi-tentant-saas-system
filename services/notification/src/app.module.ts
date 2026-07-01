import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './core/database/typeorm-config.service';
import { AuthModule } from './modules/auth/auth.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { PreferencesModule } from './modules/preferences/preferences.module';
import { DispatcherModule } from './modules/dispatcher/dispatcher.module';
import { InAppModule } from './modules/in-app/in-app.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { HealthModule } from './modules/health/health.module';
import { JwtAuthGuardImpl } from './modules/auth/guards/jwt-auth-impl.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        pinoHttp: {
          level: cs.get('NODE_ENV') === 'production' ? 'info' : 'debug',
          transport: cs.get('NODE_ENV') !== 'production' ? { target: 'pino-pretty', options: { singleLine: true } } : undefined,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => new DataSource(options).initialize(),
    }),
    AuthModule,
    TemplatesModule,
    PreferencesModule,
    DispatcherModule,
    InAppModule,
    DeliveryModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuardImpl }],
})
export class AppModule {}
