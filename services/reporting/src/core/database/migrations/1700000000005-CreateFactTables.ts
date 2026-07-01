import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFactTables1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // fact_expenses
    await queryRunner.createTable(
      new Table({
        name: 'fact_expenses',
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
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'category_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'expense_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'approved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'fact_expenses',
      new TableIndex({
        name: 'IDX_FACT_EXP_ORG_DATE',
        columnNames: ['org_id', 'expense_date'],
      }),
    );

    await queryRunner.createIndex(
      'fact_expenses',
      new TableIndex({
        name: 'IDX_FACT_EXP_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );

    // fact_payroll
    await queryRunner.createTable(
      new Table({
        name: 'fact_payroll',
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
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'period_start',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'period_end',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'gross_salary',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'net_salary',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'total_tax',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'reimbursements',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'fact_payroll',
      new TableIndex({
        name: 'IDX_FACT_PAY_ORG_PERIOD',
        columnNames: ['org_id', 'period_start'],
      }),
    );

    // fact_invoices
    await queryRunner.createTable(
      new Table({
        name: 'fact_invoices',
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
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'amount_paid',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'issue_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'fact_invoices',
      new TableIndex({
        name: 'IDX_FACT_INV_ORG_DATE',
        columnNames: ['org_id', 'issue_date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('fact_invoices');
    await queryRunner.dropTable('fact_payroll');
    await queryRunner.dropTable('fact_expenses');
  }
}
