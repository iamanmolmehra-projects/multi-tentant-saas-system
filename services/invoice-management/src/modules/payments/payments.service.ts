import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentsRepository } from './repositories/payments.repository';
import { InvoicesRepository } from '../invoices/repositories/invoices.repository';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { InvoicePaymentEntity } from './entities/invoice-payment.entity';
import { InvoiceEntity } from '../invoices/entities/invoice.entity';

/**
 * PaymentsService handles recording payments against invoices.
 *
 * Key guarantees:
 * - Idempotency: duplicate payment attempts (same idempotency_key) return existing payment
 * - Atomicity: payment recording and invoice amount updates happen in a single transaction
 * - Overpayment protection: cannot pay more than the amount_due
 */
@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly invoicesRepository: InvoicesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async recordPayment(orgId: string, dto: RecordPaymentDto): Promise<InvoicePaymentEntity> {
    // Idempotency check: return existing payment if key already used
    const existing = await this.paymentsRepository.findByIdempotencyKey(dto.idempotencyKey);
    if (existing) {
      return existing;
    }

    // Validate invoice exists and belongs to org
    const invoice = await this.invoicesRepository.findById(dto.invoiceId, orgId);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${dto.invoiceId} not found`);
    }

    if (invoice.status === 'void' || invoice.status === 'draft') {
      throw new BadRequestException(`Cannot record payment against a ${invoice.status} invoice`);
    }

    if (dto.amount > Number(invoice.amountDue)) {
      throw new BadRequestException(
        `Payment amount (${dto.amount}) exceeds the outstanding amount (${invoice.amountDue})`,
      );
    }

    // Atomic operation: record payment + update invoice in a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create payment record
      const payment = queryRunner.manager.create(InvoicePaymentEntity, {
        orgId,
        invoiceId: dto.invoiceId,
        amount: dto.amount,
        currency: dto.currency || invoice.currency,
        paymentMethod: dto.paymentMethod || null,
        paymentDate: new Date(dto.paymentDate),
        referenceNumber: dto.referenceNumber || null,
        gatewayRef: dto.gatewayRef || null,
        notes: dto.notes || null,
        idempotencyKey: dto.idempotencyKey,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Update invoice totals
      const newAmountPaid = Number(invoice.amountPaid) + dto.amount;
      const newAmountDue = Number(invoice.totalAmount) - newAmountPaid;
      const newStatus = newAmountDue <= 0 ? 'paid' : 'partially_paid';

      await queryRunner.manager.update(InvoiceEntity, { id: invoice.id }, {
        amountPaid: newAmountPaid,
        amountDue: Math.max(0, newAmountDue),
        status: newStatus,
      });

      await queryRunner.commitTransaction();
      return savedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Handle unique constraint violation on idempotency_key (race condition)
      if ((error as any)?.code === '23505') {
        const existingPayment = await this.paymentsRepository.findByIdempotencyKey(dto.idempotencyKey);
        if (existingPayment) return existingPayment;
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByInvoice(orgId: string, invoiceId: string): Promise<InvoicePaymentEntity[]> {
    return this.paymentsRepository.findByInvoice(orgId, invoiceId);
  }

  async findById(id: string, orgId: string): Promise<InvoicePaymentEntity> {
    const payment = await this.paymentsRepository.findById(id, orgId);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }
}
