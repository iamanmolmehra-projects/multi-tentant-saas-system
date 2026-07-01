import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../modules/categories/entities/category.entity';

interface DefaultCategory {
  name: string;
  code: string;
  description: string;
}

const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    name: 'Travel',
    code: 'TRAVEL',
    description: 'Travel-related expenses including flights, hotels, and car rentals',
  },
  {
    name: 'Meals',
    code: 'MEALS',
    description: 'Meals and dining expenses during business activities',
  },
  {
    name: 'Office Supplies',
    code: 'OFFICE_SUPPLIES',
    description: 'Office supplies, stationery, and equipment',
  },
  {
    name: 'Transportation',
    code: 'TRANSPORTATION',
    description: 'Local transportation including cab, metro, and fuel',
  },
  {
    name: 'Communication',
    code: 'COMMUNICATION',
    description: 'Phone, internet, and communication expenses',
  },
  {
    name: 'Miscellaneous',
    code: 'MISCELLANEOUS',
    description: 'Other uncategorized business expenses',
  },
];

/**
 * Seeds default expense categories for all organizations.
 * This seed is idempotent - it will not create duplicates if run multiple times.
 * Requires at least one organization to exist in the database.
 */
@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async run(): Promise<void> {
    // Get distinct org_ids from existing categories or from a known source
    // For seeding, we create defaults for any org that doesn't have them yet
    // This assumes a multi-tenant scenario where we seed per org
    const existingOrgs = await this.categoryRepo
      .createQueryBuilder('cat')
      .select('DISTINCT cat.org_id', 'orgId')
      .getRawMany<{ orgId: string }>();

    // If no categories exist yet, seed will be triggered per org on first use
    // For initial setup, query organizations table directly
    const orgs = await this.categoryRepo.manager.query(
      `SELECT id FROM organizations WHERE is_active = true`,
    ).catch(() => []) as Array<{ id: string }>;

    const orgIds = new Set([
      ...existingOrgs.map((o) => o.orgId),
      ...orgs.map((o) => o.id),
    ]);

    for (const orgId of orgIds) {
      await this.seedForOrg(orgId);
    }
  }

  async seedForOrg(orgId: string): Promise<void> {
    for (const category of DEFAULT_CATEGORIES) {
      const existing = await this.categoryRepo.findOne({
        where: { orgId, code: category.code },
      });

      if (!existing) {
        await this.categoryRepo.save(
          this.categoryRepo.create({
            orgId,
            name: category.name,
            code: category.code,
            description: category.description,
            isActive: true,
          }),
        );
      }
    }
  }
}
