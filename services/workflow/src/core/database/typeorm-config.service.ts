import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('DATABASE_TYPE', 'postgres') as 'postgres',
      host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
      port: this.configService.get<number>('DATABASE_PORT', 5432),
      username: this.configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: this.configService.get<string>('DATABASE_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DATABASE_NAME', 'multi_tenant_workflow'),
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
      synchronize: false,
      logging: this.configService.get<string>('NODE_ENV') !== 'production',
      extra: {
        max: this.configService.get<number>('DATABASE_MAX_CONNECTIONS', 100),
      },
    };
  }
}
