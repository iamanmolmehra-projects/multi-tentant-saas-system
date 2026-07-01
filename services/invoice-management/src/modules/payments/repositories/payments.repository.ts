import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoicePaymentEntity } from '../entities/invoice-payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(InvoicePaymentEntity)
    private readonly repo: Repository<InvoicePaymentEntity>,
  ) {}

  async findById(id: string, orgId: string): Promise<InvoicePaymentEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['invoice'],
    });
  }

  async findByIdempotencyKey(key: string): Promise<InvoicePaymentEntity | null> {
    return this.repo.findOne({
      where: { idempotencyKey: key },
    });
  }

  async findByInvoice(orgId: string, invoiceId: string): Promise<InvoicePaymentEntity[]> {
    return this.repo.find({
      where: { orgId, invoiceId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<InvoicePaymentEntity>): Promise<InvoicePaymentEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
