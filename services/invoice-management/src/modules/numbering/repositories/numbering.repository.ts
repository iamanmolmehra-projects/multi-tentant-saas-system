import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceNumberingEntity } from '../entities/invoice-numbering.entity';

@Injectable()
export class NumberingRepository {
  constructor(
    @InjectRepository(InvoiceNumberingEntity)
    private readonly repo: Repository<InvoiceNumberingEntity>,
  ) {}

  async findByOrgId(orgId: string): Promise<InvoiceNumberingEntity | null> {
    return this.repo.findOne({ where: { orgId } });
  }

  async create(data: Partial<InvoiceNumberingEntity>): Promise<InvoiceNumberingEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(orgId: string, data: Partial<InvoiceNumberingEntity>): Promise<InvoiceNumberingEntity | null> {
    const result = await this.repo.update({ orgId }, data as any);
    if (result.affected === 0) {
      return null;
    }
    return this.findByOrgId(orgId);
  }
}
