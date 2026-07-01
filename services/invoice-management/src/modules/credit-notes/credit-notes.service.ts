import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditNoteEntity } from './entities/credit-note.entity';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';

@Injectable()
export class CreditNotesService {
  constructor(
    @InjectRepository(CreditNoteEntity)
    private readonly repo: Repository<CreditNoteEntity>,
  ) {}

  async create(orgId: string, userId: string, dto: CreateCreditNoteDto): Promise<CreditNoteEntity> {
    const creditNumber = await this.generateCreditNumber(orgId);

    const entity = this.repo.create({
      orgId,
      invoiceId: dto.invoiceId,
      creditNumber,
      amount: dto.amount,
      reason: dto.reason || null,
      status: 'issued',
      createdBy: userId,
    });

    return this.repo.save(entity);
  }

  async findAll(orgId: string, invoiceId?: string): Promise<CreditNoteEntity[]> {
    const where: Record<string, unknown> = { orgId };
    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    return this.repo.find({
      where,
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, orgId: string): Promise<CreditNoteEntity> {
    const entity = await this.repo.findOne({
      where: { id, orgId },
      relations: ['invoice'],
    });
    if (!entity) {
      throw new NotFoundException(`Credit note with id ${id} not found`);
    }
    return entity;
  }

  private async generateCreditNumber(orgId: string): Promise<string> {
    const count = await this.repo.count({ where: { orgId } });
    const nextNumber = String(count + 1).padStart(5, '0');
    return `CN-${nextNumber}`;
  }
}
