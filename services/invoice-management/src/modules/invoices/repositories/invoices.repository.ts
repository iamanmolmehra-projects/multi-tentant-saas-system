import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from '../entities/invoice.entity';

@Injectable()
export class InvoicesRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repo: Repository<InvoiceEntity>,
  ) {}

  async create(data: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<InvoiceEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['customer', 'lineItems'],
    });
  }

  async findAllByOrg(
    orgId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      customerId?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<[InvoiceEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.lineItems', 'lineItems')
      .where('invoice.org_id = :orgId', { orgId });

    if (options.status) {
      qb.andWhere('invoice.status = :status', { status: options.status });
    }

    if (options.customerId) {
      qb.andWhere('invoice.customer_id = :customerId', { customerId: options.customerId });
    }

    if (options.fromDate) {
      qb.andWhere('invoice.issue_date >= :fromDate', { fromDate: options.fromDate });
    }

    if (options.toDate) {
      qb.andWhere('invoice.issue_date <= :toDate', { toDate: options.toDate });
    }

    qb.skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('invoice.created_at', 'DESC');

    return qb.getManyAndCount();
  }

  async update(id: string, orgId: string, data: Partial<InvoiceEntity>): Promise<InvoiceEntity | null> {
    const result = await this.repo.update({ id, orgId }, data as any);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id, orgId);
  }

  async save(entity: InvoiceEntity): Promise<InvoiceEntity> {
    return this.repo.save(entity);
  }

  async softDelete(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.softDelete({ id, orgId });
    return (result.affected ?? 0) > 0;
  }
}
