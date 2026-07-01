import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from '../typeorm-config.service';
import { CategoryEntity } from '../../../modules/categories/entities/category.entity';

import { CategorySeedService } from './category-seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),
    TypeOrmModule.forFeature([CategoryEntity]),
  ],
  providers: [CategorySeedService],
})
export class SeedModule {}
