import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateInvoices1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
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
            name: 'invoice_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'draft'",
          },
          {
            name: 'issue_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'tax_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'amount_paid',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'amount_due',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'INR'",
          },
          {
            name: 'exchange_rate',
            type: 'decimal',
            precision: 10,
            scale: 6,
            default: 1,
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
            name: 'pdf_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'recurring_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
          {
            name: 'created_by',
            type: 'uuid',
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        name: 'FK_INVOICE_CUSTOMER',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_INV_ORG_NUMBER',
        columnNames: ['org_id', 'invoice_number'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_INV_ORG_STATUS',
        columnNames: ['org_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_INV_CUSTOMER',
        columnNames: ['customer_id'],
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_INV_DUE_DATE',
        columnNames: ['due_date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
