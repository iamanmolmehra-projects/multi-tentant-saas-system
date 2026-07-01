import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InvoiceNumberingEntity } from './entities/invoice-numbering.entity';

/**
 * NumberingService generates sequential, gap-free invoice numbers.
 *
 * CRITICAL: Uses SELECT ... FOR UPDATE (pessimistic write lock) on the
 * invoice_numbering row to guarantee that concurrent requests cannot
 * generate duplicate or out-of-order numbers.
 */
@Injectable()
export class NumberingService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Atomically increments the numbering counter and returns the formatted invoice number.
   * This method MUST be called within a serialized context — it creates its own transaction
   * with pessimistic locking to ensure gap-free sequential numbers.
   */
  async getNextNumber(orgId: string): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // SELECT FOR UPDATE — locks the row for this org until transaction commits
      const numbering = await queryRunner.manager
        .getRepository(InvoiceNumberingEntity)
        .createQueryBuilder('numbering')
        .setLock('pessimistic_write')
        .where('numbering.org_id = :orgId', { orgId })
        .getOne();

      if (!numbering) {
        // Auto-create numbering config for new orgs with defaults
        const newNumbering = queryRunner.manager.create(InvoiceNumberingEntity, {
          orgId,
          prefix: 'INV',
          separator: '-',
          currentNumber: 1,
          padding: 5,
          financialYearReset: true,
        });

        await queryRunner.manager.save(newNumbering);
        await queryRunner.commitTransaction();

        return this.formatNumber(newNumbering.prefix, newNumbering.separator, 1, newNumbering.padding);
      }

      // Increment the counter
      const nextNumber = Number(numbering.currentNumber) + 1;
      numbering.currentNumber = nextNumber;

      await queryRunner.manager.save(numbering);
      await queryRunner.commitTransaction();

      return this.formatNumber(numbering.prefix, numbering.separator, nextNumber, numbering.padding);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to generate invoice number. Please retry.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Formats the invoice number with prefix, separator, and zero-padded number.
   * Example: INV-00042
   */
  private formatNumber(
    prefix: string,
    separator: string,
    number: number,
    padding: number,
  ): string {
    const paddedNumber = String(number).padStart(padding, '0');
    return `${prefix}${separator}${paddedNumber}`;
  }
}
