import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesRepository } from './repositories/invoices.repository';
import { NumberingService } from '../numbering/numbering.service';
import { TaxService } from '../tax/tax.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceLineItemEntity } from './entities/invoice-line-item.entity';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly numberingService: NumberingService,
    private readonly taxService: TaxService,
  ) {}

  async create(orgId: string, userId: string, dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const lineItems = this.buildLineItems(dto.lineItems);
    const { subtotal, taxAmount, discountAmount, totalAmount } = this.calculateTotals(lineItems);

    const invoice = await this.invoicesRepository.create({
      orgId,
      customerId: dto.customerId,
      status: 'draft',
      issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      amountPaid: 0,
      amountDue: totalAmount,
      currency: dto.currency || 'INR',
      exchangeRate: dto.exchangeRate || 1,
      notes: dto.notes || null,
      terms: dto.terms || null,
      metadata: dto.metadata || null,
      createdBy: userId,
      lineItems,
    });

    return invoice;
  }

  async findAll(
    orgId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      customerId?: string;
      fromDate?: string;
      toDate?: string;
    },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const [data, total] = await this.invoicesRepository.findAllByOrg(orgId, {
      page,
      limit,
      status: options.status,
      customerId: options.customerId,
      fromDate: options.fromDate,
      toDate: options.toDate,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, orgId: string): Promise<InvoiceEntity> {
    const invoice = await this.invoicesRepository.findById(id, orgId);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return invoice;
  }

  async update(id: string, orgId: string, dto: UpdateInvoiceDto): Promise<InvoiceEntity> {
    const invoice = await this.findById(id, orgId);

    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be edited');
    }

    if (dto.lineItems) {
      const lineItems = this.buildLineItems(dto.lineItems);
      const { subtotal, taxAmount, discountAmount, totalAmount } = this.calculateTotals(lineItems);

      invoice.lineItems = lineItems;
      invoice.subtotal = subtotal;
      invoice.taxAmount = taxAmount;
      invoice.discountAmount = discountAmount;
      invoice.totalAmount = totalAmount;
      invoice.amountDue = totalAmount - invoice.amountPaid;
    }

    if (dto.issueDate) invoice.issueDate = new Date(dto.issueDate);
    if (dto.dueDate) invoice.dueDate = new Date(dto.dueDate);
    if (dto.currency) invoice.currency = dto.currency;
    if (dto.exchangeRate) invoice.exchangeRate = dto.exchangeRate;
    if (dto.notes !== undefined) invoice.notes = dto.notes || null;
    if (dto.terms !== undefined) invoice.terms = dto.terms || null;
    if (dto.metadata !== undefined) invoice.metadata = dto.metadata || null;

    return this.invoicesRepository.save(invoice);
  }

  async send(id: string, orgId: string): Promise<InvoiceEntity> {
    const invoice = await this.findById(id, orgId);

    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be sent');
    }

    // Generate invoice number using pessimistic locking
    const invoiceNumber = await this.numberingService.getNextNumber(orgId);

    invoice.invoiceNumber = invoiceNumber;
    invoice.status = 'sent';
    invoice.issueDate = invoice.issueDate || new Date();

    return this.invoicesRepository.save(invoice);
  }

  async void(id: string, orgId: string): Promise<InvoiceEntity> {
    const invoice = await this.findById(id, orgId);

    if (invoice.status === 'void') {
      throw new BadRequestException('Invoice is already voided');
    }

    if (invoice.amountPaid > 0) {
      throw new BadRequestException('Cannot void an invoice with recorded payments');
    }

    invoice.status = 'void';
    return this.invoicesRepository.save(invoice);
  }

  async delete(id: string, orgId: string): Promise<void> {
    const invoice = await this.findById(id, orgId);

    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be deleted');
    }

    await this.invoicesRepository.softDelete(id, orgId);
  }

  private buildLineItems(
    items: CreateInvoiceDto['lineItems'],
  ): InvoiceLineItemEntity[] {
    return items.map((item, index) => {
      const quantity = item.quantity ?? 1;
      const unitPrice = item.unitPrice;
      const taxRate = item.taxRate ?? 0;
      const discountRate = item.discountRate ?? 0;

      const grossAmount = quantity * unitPrice;
      const discountAmount = grossAmount * (discountRate / 100);
      const taxableAmount = grossAmount - discountAmount;
      const taxAmount = taxableAmount * (taxRate / 100);
      const lineTotal = taxableAmount + taxAmount;

      const lineItem = new InvoiceLineItemEntity();
      lineItem.description = item.description;
      lineItem.quantity = quantity;
      lineItem.unitPrice = unitPrice;
      lineItem.taxRate = taxRate;
      lineItem.taxAmount = taxAmount;
      lineItem.discountRate = discountRate;
      lineItem.lineTotal = lineTotal;
      lineItem.hsnCode = item.hsnCode || null;
      lineItem.sortOrder = item.sortOrder ?? index;

      return lineItem;
    });
  }

  private calculateTotals(lineItems: InvoiceLineItemEntity[]) {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    for (const item of lineItems) {
      const grossAmount = item.quantity * item.unitPrice;
      const itemDiscount = grossAmount * (item.discountRate / 100);
      subtotal += grossAmount - itemDiscount;
      taxAmount += item.taxAmount;
      discountAmount += itemDiscount;
    }

    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, discountAmount, totalAmount };
  }
}
