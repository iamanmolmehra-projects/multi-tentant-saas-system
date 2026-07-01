import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceNumberingEntity } from '../../../modules/numbering/entities/invoice-numbering.entity';

/**
 * Seeds default invoice numbering configuration for active organizations.
 * This seed is idempotent — it will not overwrite existing numbering configs.
 */
@Injectable()
export class NumberingSeedService {
  constructor(
    @InjectRepository(InvoiceNumberingEntity)
    private readonly numberingRepo: Repository<InvoiceNumberingEntity>,
  ) {}

  async run(): Promise<void> {
    // Query active organizations from the organizations table
    const orgs = await this.numberingRepo.manager
      .query(`SELECT id FROM organizations WHERE is_active = true`)
      .catch(() => []) as Array<{ id: string }>;

    for (const org of orgs) {
      await this.seedForOrg(org.id);
    }
  }

  async seedForOrg(orgId: string): Promise<void> {
    const existing = await this.numberingRepo.findOne({ where: { orgId } });

    if (!existing) {
      await this.numberingRepo.save(
        this.numberingRepo.create({
          orgId,
          prefix: 'INV',
          separator: '-',
          currentNumber: 0,
          padding: 5,
          financialYearReset: true,
        }),
      );
    }
  }
}
