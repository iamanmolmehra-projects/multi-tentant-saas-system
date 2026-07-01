import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePayrollCycles1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payroll_cycles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'org_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'frequency',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'pay_day',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'payroll_cycles',
      new TableIndex({
        name: 'IDX_CYCLE_ORG',
        columnNames: ['org_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payroll_cycles');
  }
}
