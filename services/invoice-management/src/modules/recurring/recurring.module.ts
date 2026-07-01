import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringInvoiceEntity } from './entities/recurring-invoice.entity';
import { RecurringController } from './recurring.controller';
import { RecurringService } from './recurring.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringInvoiceEntity]),
    InvoicesModule,
    CustomersModule,
  ],
  controllers: [RecurringController],
  providers: [RecurringService],
  exports: [RecurringService],
})
export class RecurringModule {}
