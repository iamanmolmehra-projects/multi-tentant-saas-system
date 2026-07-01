import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicePaymentEntity } from './entities/invoice-payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoicePaymentEntity]),
    forwardRef(() => InvoicesModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
