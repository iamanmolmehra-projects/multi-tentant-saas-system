import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from './core/database/typeorm-config.service';
import { JwtAuthGuardImpl } from './modules/auth/guards/jwt-auth-impl.guard';
import { AuthModule } from './modules/auth/auth.module';
import { SalaryStructuresModule } from './modules/salary-structures/salary-structures.module';
import { PayrollCyclesModule } from './modules/payroll-cycles/payroll-cycles.module';
import { PayrollRunsModule } from './modules/payroll-runs/payroll-runs.module';
import { PayslipsModule } from './modules/payslips/payslips.module';
import { TaxModule } from './modules/tax/tax.module';
import { ReimbursementsModule } from './modules/reimbursements/reimbursements.module';
import { DisbursementsModule } from './modules/disbursements/disbursements.module';
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
    SalaryStructuresModule,
    PayrollCyclesModule,
    PayrollRunsModule,
    PayslipsModule,
    TaxModule,
    ReimbursementsModule,
    DisbursementsModule,
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
