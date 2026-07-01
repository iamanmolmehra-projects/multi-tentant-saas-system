import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: (process.env.DATABASE_TYPE || 'postgres') as 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'multi_tenant_payroll',
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
} as DataSourceOptions);
