import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './repositories/customers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
  exports: [CustomersService, CustomersRepository],
})
export class CustomersModule {}
