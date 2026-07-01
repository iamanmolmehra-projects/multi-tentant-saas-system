import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repo: Repository<CustomerEntity>,
  ) {}

  async create(data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<CustomerEntity | null> {
    return this.repo.findOne({ where: { id, orgId } });
  }

  async findAllByOrg(
    orgId: string,
    options: { page: number; limit: number; search?: string },
  ): Promise<[CustomerEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder('customer')
      .where('customer.org_id = :orgId', { orgId })
      .andWhere('customer.is_active = :isActive', { isActive: true });

    if (options.search) {
      qb.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    qb.skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('customer.name', 'ASC');

    return qb.getManyAndCount();
  }

  async save(entity: CustomerEntity): Promise<CustomerEntity> {
    return this.repo.save(entity);
  }

  async softDelete(id: string, orgId: string): Promise<boolean> {
    const result = await this.repo.softDelete({ id, orgId });
    return (result.affected ?? 0) > 0;
  }
}
