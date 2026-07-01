import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceLineItemEntity } from './entities/invoice-line-item.entity';
import { InvoicesRepository } from './repositories/invoices.repository';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { NumberingModule } from '../numbering/numbering.module';
import { TaxModule } from '../tax/tax.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity, InvoiceLineItemEntity]),
    NumberingModule,
    TaxModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository],
  exports: [InvoicesService, InvoicesRepository],
})
export class InvoicesModule {}
