import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringInvoiceEntity } from './entities/recurring-invoice.entity';
import { InvoicesService } from '../invoices/invoices.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';

@Injectable()
export class RecurringService {
  constructor(
    @InjectRepository(RecurringInvoiceEntity)
    private readonly repo: Repository<RecurringInvoiceEntity>,
    private readonly invoicesService: InvoicesService,
  ) {}

  async create(orgId: string, dto: CreateRecurringDto): Promise<RecurringInvoiceEntity> {
    const entity = this.repo.create({
      orgId,
      customerId: dto.customerId,
      frequency: dto.frequency,
      nextIssueDate: dto.nextIssueDate ? new Date(dto.nextIssueDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      lineItems: dto.lineItems || null,
      notes: dto.notes || null,
      terms: dto.terms || null,
      isActive: true,
    });

    return this.repo.save(entity);
  }

  async findAll(orgId: string): Promise<RecurringInvoiceEntity[]> {
    return this.repo.find({
      where: { orgId },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, orgId: string): Promise<RecurringInvoiceEntity> {
    const entity = await this.repo.findOne({
      where: { id, orgId },
      relations: ['customer'],
    });
    if (!entity) {
      throw new NotFoundException(`Recurring invoice template with id ${id} not found`);
    }
    return entity;
  }

  async update(id: string, orgId: string, dto: UpdateRecurringDto): Promise<RecurringInvoiceEntity> {
    const entity = await this.findById(id, orgId);

    if (dto.frequency) entity.frequency = dto.frequency;
    if (dto.nextIssueDate) entity.nextIssueDate = new Date(dto.nextIssueDate);
    if (dto.endDate !== undefined) entity.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.lineItems !== undefined) entity.lineItems = dto.lineItems || null;
    if (dto.notes !== undefined) entity.notes = dto.notes || null;
    if (dto.terms !== undefined) entity.terms = dto.terms || null;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;

    return this.repo.save(entity);
  }

  async deactivate(id: string, orgId: string): Promise<void> {
    const entity = await this.findById(id, orgId);
    entity.isActive = false;
    await this.repo.save(entity);
  }

  /**
   * Generates a new invoice from a recurring invoice template.
   * Copies line items, notes, and terms from the template.
   */
  async generateFromTemplate(id: string, orgId: string, userId: string) {
    const template = await this.findById(id, orgId);

    const lineItems = (template.lineItems || []).map((item: any) => ({
      description: item.description,
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate ?? 0,
      discountRate: item.discountRate ?? 0,
      hsnCode: item.hsnCode || undefined,
      sortOrder: item.sortOrder ?? 0,
    }));

    const createDto: CreateInvoiceDto = {
      customerId: template.customerId,
      issueDate: new Date().toISOString().split('T')[0],
      lineItems,
      notes: template.notes || undefined,
      terms: template.terms || undefined,
    };

    const invoice = await this.invoicesService.create(orgId, userId, createDto);

    // Update template tracking fields
    template.lastGeneratedAt = new Date();
    template.nextIssueDate = this.calculateNextDate(
      template.nextIssueDate || new Date(),
      template.frequency,
    );
    await this.repo.save(template);

    return invoice;
  }

  private calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);

    switch (frequency) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(next.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'semi_annually':
        next.setMonth(next.getMonth() + 6);
        break;
      case 'annually':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
    }

    return next;
  }
}
