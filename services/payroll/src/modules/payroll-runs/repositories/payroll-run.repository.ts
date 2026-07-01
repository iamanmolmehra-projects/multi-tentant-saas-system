import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PayrollRunEntity } from '../entities/payroll-run.entity';

@Injectable()
export class PayrollRunRepository {
  constructor(
    @InjectRepository(PayrollRunEntity)
    private readonly repo: Repository<PayrollRunEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: Partial<PayrollRunEntity>): Promise<PayrollRunEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string, orgId: string): Promise<PayrollRunEntity | null> {
    return this.repo.findOne({
      where: { id, orgId },
      relations: ['cycle', 'payslips'],
    });
  }

  async findByIdempotencyKey(key: string): Promise<PayrollRunEntity | null> {
    return this.repo.findOne({ where: { idempotencyKey: key } });
  }

  async findAllByOrg(orgId: string): Promise<PayrollRunEntity[]> {
    return this.repo.find({
      where: { orgId },
      relations: ['cycle'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Acquires a pessimistic lock using the lock_key column.
   * This ensures only one payroll run can be processed at a time
   * for a given org+cycle+period combination.
   */
  async acquireLock(lockKey: string, runId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Try to set the lock_key - will fail if another run holds it (unique constraint)
      await queryRunner.query(
        `UPDATE payroll_runs SET lock_key = $1 WHERE id = $2 AND lock_key IS NULL`,
        [lockKey, runId],
      );

      await queryRunner.commitTransaction();
      return true;
    } catch {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseLock(runId: string): Promise<void> {
    await this.repo.update({ id: runId }, { lockKey: null });
  }

  async update(id: string, orgId: string, data: Partial<PayrollRunEntity>): Promise<PayrollRunEntity | null> {
    const result = await this.repo.update({ id, orgId }, data as any);
    if (result.affected === 0) return null;
    return this.findById(id, orgId);
  }

  async updateStatus(id: string, status: string, additionalData?: Partial<PayrollRunEntity>): Promise<void> {
    await this.repo.update({ id }, { status, ...additionalData } as any);
  }
}
