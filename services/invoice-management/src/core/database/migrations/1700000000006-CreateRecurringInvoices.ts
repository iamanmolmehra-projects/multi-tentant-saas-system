import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRecurringInvoices1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recurring_invoices',
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
            name: 'frequency',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'next_issue_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'line_items',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'terms',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_generated_at',
            type: 'timestamp',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'recurring_invoices',
      new TableForeignKey({
        name: 'FK_RECURRING_CUSTOMER',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'recurring_invoices',
      new TableIndex({
        name: 'IDX_RECURRING_ORG',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'recurring_invoices',
      new TableIndex({
        name: 'IDX_RECURRING_NEXT_DATE',
        columnNames: ['next_issue_date', 'is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recurring_invoices');
  }
}
