import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from './repositories/customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(orgId: string, dto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.customersRepository.create({
      orgId,
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone || null,
      billingAddress: dto.billingAddress || null,
      shippingAddress: dto.shippingAddress || null,
      taxId: dto.taxId || null,
      currency: dto.currency || 'INR',
      isActive: true,
    });
  }

  async findAll(
    orgId: string,
    options: { page?: number; limit?: number; search?: string },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const [data, total] = await this.customersRepository.findAllByOrg(orgId, {
      page,
      limit,
      search: options.search,
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

  async findById(id: string, orgId: string): Promise<CustomerEntity> {
    const customer = await this.customersRepository.findById(id, orgId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: string, orgId: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findById(id, orgId);

    if (dto.name !== undefined) customer.name = dto.name;
    if (dto.email !== undefined) customer.email = dto.email || null;
    if (dto.phone !== undefined) customer.phone = dto.phone || null;
    if (dto.billingAddress !== undefined) customer.billingAddress = dto.billingAddress || null;
    if (dto.shippingAddress !== undefined) customer.shippingAddress = dto.shippingAddress || null;
    if (dto.taxId !== undefined) customer.taxId = dto.taxId || null;
    if (dto.currency !== undefined) customer.currency = dto.currency;
    if (dto.isActive !== undefined) customer.isActive = dto.isActive;

    return this.customersRepository.save(customer);
  }

  async softDelete(id: string, orgId: string): Promise<void> {
    await this.findById(id, orgId);
    await this.customersRepository.softDelete(id, orgId);
  }
}
