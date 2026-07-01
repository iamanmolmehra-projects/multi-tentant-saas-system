import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInvoicePayments1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_payments',
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
            name: 'invoice_id',
            type: 'uuid',
            isNullable: false,
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
            default: "'INR'",
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'payment_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'reference_number',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gateway_ref',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'idempotency_key',
            type: 'varchar',
            length: '64',
            isNullable: false,
            isUnique: true,
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

    await queryRunner.createForeignKey(
      'invoice_payments',
      new TableForeignKey({
        name: 'FK_PAYMENT_INVOICE',
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'invoice_payments',
      new TableIndex({
        name: 'IDX_PAYMENT_ORG_INVOICE',
        columnNames: ['org_id', 'invoice_id'],
      }),
    );

    await queryRunner.createIndex(
      'invoice_payments',
      new TableIndex({
        name: 'IDX_PAYMENT_IDEMPOTENCY',
        columnNames: ['idempotency_key'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_payments');
  }
}
