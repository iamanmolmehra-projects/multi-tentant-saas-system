import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from './core/database/typeorm-config.service';
import { JwtAuthGuardImpl } from './modules/auth/guards/jwt-auth-impl.guard';
import { AuthModule } from './modules/auth/auth.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { NumberingModule } from './modules/numbering/numbering.module';
import { TaxModule } from './modules/tax/tax.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RecurringModule } from './modules/recurring/recurring.module';
import { CreditNotesModule } from './modules/credit-notes/credit-notes.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { CustomersModule } from './modules/customers/customers.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('NODE_ENV') === 'production' ? 'info' : 'debug',
          transport:
            configService.get('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty', options: { singleLine: true } }
              : undefined,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),
    AuthModule,
    InvoicesModule,
    NumberingModule,
    TaxModule,
    PaymentsModule,
    RecurringModule,
    CreditNotesModule,
    PdfModule,
    CustomersModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuardImpl,
    },
  ],
})
export class AppModule {}
